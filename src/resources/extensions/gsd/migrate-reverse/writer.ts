/**
 * Writer for reverse migration (.gsd/ → .planning/)
 *
 * Writes the v1 directory structure from the transformed PlanningV1Project.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type {
  PlanningV1Project,
  PlanningV1Phase,
  PlanningV1Plan,
  PlanningV1Summary,
} from './types.js';

export interface WriteResult {
  paths: string[];
}

/**
 * Write the v1 .planning/ directory to disk.
 */
export function writePlanningDirectory(project: PlanningV1Project, targetDir: string = process.cwd()): WriteResult {
  const planningDir = join(targetDir, '.planning');
  const paths: string[] = [];

  // Ensure .planning directory exists
  mkdirSync(planningDir, { recursive: true });

  // Write ROADMAP.md
  const roadmapPath = join(planningDir, 'ROADMAP.md');
  writeFileSync(roadmapPath, project.roadmap, 'utf-8');
  paths.push(roadmapPath);

  // Write REQUIREMENTS.md
  const requirementsPath = join(planningDir, 'REQUIREMENTS.md');
  writeFileSync(requirementsPath, project.requirements, 'utf-8');
  paths.push(requirementsPath);

  // Write STATE.md
  const statePath = join(planningDir, 'STATE.md');
  writeFileSync(statePath, project.state, 'utf-8');
  paths.push(statePath);

  // Write config.json
  const configPath = join(planningDir, 'config.json');
  writeFileSync(configPath, JSON.stringify(project.config, null, 2), 'utf-8');
  paths.push(configPath);

  // Write phase directories
  for (const phase of project.phases) {
    const phaseDirName = `${phase.number}-${phase.slug}`;
    const phaseDir = join(planningDir, phaseDirName);
    mkdirSync(phaseDir, { recursive: true });

    // Write PLAN.md files
    for (const plan of phase.plans) {
      const planPath = join(phaseDir, plan.fileName);
      const content = buildPlanFile(plan);
      writeFileSync(planPath, content, 'utf-8');
      paths.push(planPath);
    }

    // Write SUMMARY.md files
    for (const summary of phase.summaries) {
      const summaryPath = join(phaseDir, summary.fileName);
      const content = buildSummaryFile(summary);
      writeFileSync(summaryPath, content, 'utf-8');
      paths.push(summaryPath);
    }
  }

  return { paths };
}

/**
 * Build the full PLAN.md file content with YAML frontmatter and XML tags.
 */
function buildPlanFile(plan: PlanningV1Plan): string {
  const frontmatter = buildFrontmatterYaml(plan.frontmatter);
  const sections = [
    frontmatter,
    `<objective>\n${plan.objective}\n</objective>`,
    `<tasks>\n${plan.tasks.map((t) => `  <task>${t}</task>`).join('\n')}\n</tasks>`,
    plan.context ? `<context>\n${plan.context}\n</context>` : '',
    plan.verification ? `<verification>\n${plan.verification}\n</verification>` : '',
    `<success_criteria>\n${plan.successCriteria}\n</success_criteria>`,
  ].filter(Boolean).join('\n\n');

  return sections + '\n';
}

/**
 * Build the full SUMMARY.md file content with YAML frontmatter and body.
 */
function buildSummaryFile(summary: PlanningV1Summary): string {
  const frontmatter = buildSummaryFrontmatterYaml(summary.frontmatter);
  return `${frontmatter}\n${summary.body}\n`;
}

/**
 * Build YAML frontmatter for PLAN.md.
 */
function buildFrontmatterYaml(fm: PlanningV1Plan['frontmatter']): string {
  const lines = [
    '---',
    `phase: "${fm.phase}"`,
    `plan: "${fm.plan}"`,
    `type: ${fm.type}`,
    fm.wave !== null ? `wave: ${fm.wave}` : '',
    `depends_on: ${JSON.stringify(fm.depends_on)}`,
    `files_modified: ${JSON.stringify(fm.files_modified)}`,
    `autonomous: ${fm.autonomous}`,
    fm.must_haves ? `must_haves:\n  truths: ${JSON.stringify(fm.must_haves.truths)}\n  artifacts: []\n  key_links: []` : '',
    '---',
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Build YAML frontmatter for SUMMARY.md.
 */
function buildSummaryFrontmatterYaml(fm: PlanningV1Summary['frontmatter']): string {
  const lines = [
    '---',
    `phase: "${fm.phase}"`,
    `plan: "${fm.plan}"`,
    `subsystem: "${fm.subsystem}"`,
    `tags: ${JSON.stringify(fm.tags)}`,
    `requires: ${JSON.stringify(fm.requires)}`,
    `provides: ${JSON.stringify(fm.provides)}`,
    `affects: ${JSON.stringify(fm.affects)}`,
    `tech-stack: ${JSON.stringify(fm['tech-stack'])}`,
    `key-files: ${JSON.stringify(fm['key-files'])}`,
    `key-decisions: ${JSON.stringify(fm['key-decisions'])}`,
    `patterns-established: ${JSON.stringify(fm['patterns-established'])}`,
    `duration: "${fm.duration}"`,
    `completed: "${fm.completed}"`,
    '---',
  ];

  return lines.join('\n');
}
