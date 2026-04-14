/**
 * Reverse migration: .gsd/ (GSD-2) → .planning/ (v1)
 *
 * Reverses the /gsd migrate operation, converting projects
 * from the modern GSD-2 Milestone→Slice→Task format back
 * to the v1 phase-based directory structure.
 */

export { validateGSDDirectory } from './validator.js';
export { parseGSDDirectory } from './parser.js';
export { reverseTransformToV1 } from './transformer.js';
export { writePlanningDirectory } from './writer.js';
export type {
  GSD2Project,
  GSD2Milestone,
  GSD2Slice,
  GSD2Task,
  GSD2Requirement,
  PlanningV1Project,
  PlanningV1Phase,
  PlanningV1Plan,
  PlanningV1Summary,
  ReverseMigrationPreview,
} from './types.js';

import type { GSD2Project, ReverseMigrationPreview } from './types.js';

/**
 * Generate a preview of the reverse migration.
 */
export function generateReversePreview(project: GSD2Project): ReverseMigrationPreview {
  let totalSlices = 0;
  let doneSlices = 0;
  let totalTasks = 0;
  let doneTasks = 0;

  for (const milestone of project.milestones) {
    for (const slice of milestone.slices) {
      totalSlices++;
      if (slice.done) doneSlices++;
      totalTasks += slice.tasks.length;
      doneTasks += slice.tasks.filter((t: { done: boolean }) => t.done).length;
    }
  }

  const requirements = project.requirements;
  const validated = requirements.filter((r: { status: string }) => r.status === 'validated').length;
  const active = requirements.filter((r: { status: string }) => r.status === 'active').length;
  const deferred = requirements.filter((r: { status: string }) => r.status === 'deferred').length;

  return {
    milestoneCount: project.milestones.length,
    totalSlices,
    doneSlices,
    sliceCompletionPct: totalSlices > 0 ? Math.round((doneSlices / totalSlices) * 100) : 0,
    totalTasks,
    doneTasks,
    taskCompletionPct: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    requirements: {
      total: requirements.length,
      validated,
      active,
      deferred,
    },
    phaseCount: totalSlices, // Each slice becomes a phase
  };
}
