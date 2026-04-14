/**
 * Reverse migration: .gsd/ (GSD-2) → .planning/ (v1)
 *
 * Transforms the Milestone→Slice→Task hierarchy back to the v1
 * phase-based directory structure with PLAN.md/SUMMARY.md files.
 */

import {
  type GSD2Project,
  type GSD2Milestone,
  type GSD2Slice,
  type GSD2Task,
  type GSD2TaskSummaryData,
  type GSD2SliceSummaryData,
  type PlanningV1Project,
  type PlanningV1Phase,
  type PlanningV1Plan,
  type PlanningV1PlanFrontmatter,
  type PlanningV1PlanMustHaves,
  type PlanningV1Summary,
  type PlanningV1SummaryFrontmatter,
  type PlanningV1SummaryRequires,
  type PlanningV1Config,
} from './types.js';

/**
 * Convert GSD-2 project structure to v1 planning project.
 *
 * Mapping:
 *   GSD-2 Milestone → v1 roadmap section + phase group
 *   GSD-2 Slice     → v1 phase directory (e.g. "01-slice-title")
 *   GSD-2 Task      → v1 plan file (e.g. "01-01-PLAN.md")
 *   Done slice      → v1 SUMMARY.md
 *   Requirements    → v1 REQUIREMENTS.md
 */
export function reverseTransformToV1(project: GSD2Project, projectName: string = 'project'): PlanningV1Project {
  const phases: PlanningV1Phase[] = [];
  let phaseNumber = 0;
  const roadmapLines: string[] = ['# Roadmap', ''];

  for (const milestone of project.milestones) {
    // Add milestone header to roadmap
    roadmapLines.push(`## ${milestone.id}: ${milestone.title}`, '');
    if (milestone.vision) {
      roadmapLines.push(milestone.vision, '');
    }

    for (const slice of milestone.slices) {
      phaseNumber++;
      const slug = slugify(slice.title);
      const done = slice.done;

      // Roadmap checkbox line
      roadmapLines.push(`- [${done ? 'x' : ' '}] ${phaseNumber}. ${slice.title}`);

      const plans: PlanningV1Plan[] = [];
      const summaries: PlanningV1Summary[] = [];

      for (let t = 0; t < slice.tasks.length; t++) {
        const task = slice.tasks[t];
        const planNumber = String(t + 1).padStart(2, '0');
        const planFileName = `${phaseNumber}-${planNumber}-PLAN.md`;

        // Build plan frontmatter
        const dependsOn = slice.depends.length > 0 ? slice.depends : [];
        const mustHaves: PlanningV1PlanMustHaves | null = task.mustHaves.length > 0
          ? { truths: task.mustHaves, artifacts: [], key_links: [] }
          : null;

        const frontmatter: PlanningV1PlanFrontmatter = {
          phase: `${phaseNumber}-${slug}`,
          plan: planNumber,
          type: slice.risk === 'high' ? 'implementation' : slice.risk === 'low' ? 'quick' : 'implementation',
          wave: null,
          depends_on: dependsOn,
          files_modified: task.files.length > 0 ? task.files : [],
          autonomous: true,
          must_haves: mustHaves,
        };

        const plan: PlanningV1Plan = {
          planNumber,
          fileName: planFileName,
          frontmatter,
          objective: task.description || task.title,
          tasks: [task.title],
          context: slice.demo || slice.goal,
          verification: task.mustHaves.join('\n'),
          successCriteria: `- [ ] ${task.title} completed`,
        };
        plans.push(plan);

        // If task is done (has summary), create a SUMMARY.md
        if (task.done && task.summary) {
          const summary = buildV1Summary(phaseNumber, slug, planNumber, task.summary);
          summaries.push(summary);
        }
      }

      // If slice is done but no individual task summaries, create one summary from slice summary
      if (done && summaries.length === 0 && slice.summary) {
        const summary = buildV1SummaryFromSlice(phaseNumber, slug, '01', slice.summary);
        summaries.push(summary);
      }

      const phase: PlanningV1Phase = {
        number: phaseNumber,
        slug,
        title: slice.title,
        plans,
        summaries,
        done,
      };
      phases.push(phase);
    }

    roadmapLines.push('');
  }

  // Build REQUIREMENTS.md
  const requirementsContent = buildRequirementsV1(project.requirements);

  // Build STATE.md
  const lastActivePhase = phases.find((p) => !p.done) ?? phases[phases.length - 1];
  const state = buildStateV1(lastActivePhase?.number ?? 0);

  // Build config.json
  const config: PlanningV1Config = {
    projectName,
  };

  return {
    path: '.planning',
    roadmap: roadmapLines.join('\n'),
    requirements: requirementsContent,
    state,
    config,
    phases,
  };
}

/**
 * Convert a GSD-2 requirement status to v1 format.
 */
function buildRequirementsV1(requirements: GSD2Project['requirements']): string {
  if (requirements.length === 0) {
    return '# Requirements\n\nNo requirements defined.';
  }

  const lines = ['# Requirements', ''];
  for (const req of requirements) {
    const statusBadge = `[${req.status.toUpperCase()}]`;
    lines.push(`## ${req.id}: ${req.title} ${statusBadge}`, '');
    lines.push(req.description, '');
  }
  return lines.join('\n');
}

/**
 * Build STATE.md content.
 */
function buildStateV1(currentPhase: number): string {
  return `# State\n\ncurrent_phase: ${currentPhase}\nstatus: active\n`;
}

/**
 * Build a v1 SUMMARY.md from a task summary.
 */
function buildV1Summary(
  phaseNumber: number,
  phaseSlug: string,
  planNumber: string,
  taskSummary: GSD2TaskSummaryData,
): PlanningV1Summary {
  const frontmatter: PlanningV1SummaryFrontmatter = {
    phase: `${phaseNumber}-${phaseSlug}`,
    plan: planNumber,
    subsystem: phaseSlug,
    tags: [],
    requires: [],
    provides: taskSummary.provides ?? [],
    affects: [],
    'tech-stack': [],
    'key-files': taskSummary.keyFiles ?? [],
    'key-decisions': [],
    'patterns-established': [],
    duration: taskSummary.duration ?? '',
    completed: taskSummary.completedAt ?? '',
  };

  return {
    planNumber,
    fileName: `${phaseNumber}-${planNumber}-SUMMARY.md`,
    frontmatter,
    body: taskSummary.whatHappened ?? '',
  };
}

/**
 * Build a v1 SUMMARY.md from a slice summary (fallback when no task summaries exist).
 */
function buildV1SummaryFromSlice(
  phaseNumber: number,
  phaseSlug: string,
  planNumber: string,
  sliceSummary: GSD2SliceSummaryData,
): PlanningV1Summary {
  const frontmatter: PlanningV1SummaryFrontmatter = {
    phase: `${phaseNumber}-${phaseSlug}`,
    plan: planNumber,
    subsystem: phaseSlug,
    tags: [],
    requires: [],
    provides: sliceSummary.provides ?? [],
    affects: [],
    'tech-stack': [],
    'key-files': sliceSummary.keyFiles ?? [],
    'key-decisions': sliceSummary.keyDecisions ?? [],
    'patterns-established': sliceSummary.patternsEstablished ?? [],
    duration: sliceSummary.duration ?? '',
    completed: sliceSummary.completedAt ?? '',
  };

  return {
    planNumber,
    fileName: `${phaseNumber}-${planNumber}-SUMMARY.md`,
    frontmatter,
    body: sliceSummary.whatHappened ?? '',
  };
}

/**
 * Convert a title to a URL-safe slug.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
