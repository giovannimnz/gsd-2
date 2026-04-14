/**
 * Parser for reverse migration (.gsd/ → .planning/)
 *
 * Reads the GSD-2 .gsd/ directory structure and converts it to
 * the GSD2Project intermediate representation.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type {
  GSD2Project,
  GSD2Milestone,
  GSD2Slice,
  GSD2Task,
  GSD2Requirement,
  GSD2SliceSummaryData,
  GSD2TaskSummaryData,
} from './types.js';

/**
 * Parse the .gsd/ directory into a GSD2Project object.
 */
export async function parseGSDDirectory(sourcePath: string): Promise<GSD2Project> {
  const milestones: GSD2Milestone[] = [];
  const requirements: GSD2Requirement[] = [];

  // Parse requirements if exists
  const reqPath = join(sourcePath, 'requirements.json');
  if (existsSync(reqPath)) {
    const reqData = JSON.parse(readFileSync(reqPath, 'utf-8'));
    if (Array.isArray(reqData)) {
      requirements.push(...reqData);
    }
  }

  // Parse milestone directories
  const entries = readdirSync(sourcePath);
  const milestoneDirs = entries.filter((e) => /^M\d{3}-/.test(e)).sort();

  for (const milestoneDir of milestoneDirs) {
    const milestonePath = join(sourcePath, milestoneDir);
    if (!statSync(milestonePath).isDirectory()) continue;

    const milestone = await parseMilestone(milestonePath, milestoneDir);
    if (milestone) {
      milestones.push(milestone);
    }
  }

  return { milestones, requirements };
}

/**
 * Parse a single milestone directory.
 */
async function parseMilestone(milestonePath: string, milestoneDir: string): Promise<GSD2Milestone | null> {
  // Parse state.json
  const statePath = join(milestonePath, 'state.json');
  if (!existsSync(statePath)) return null;

  const state = JSON.parse(readFileSync(statePath, 'utf-8'));

  // Extract milestone ID and title from directory name (e.g., "M001-auth-system")
  const parts = milestoneDir.split('-');
  const id = parts[0]; // "M001"
  const title = parts.slice(1).join(' ').replace(/-/g, ' ');

  // Parse slices.json
  const slicesPath = join(milestonePath, 'slices.json');
  const slices: GSD2Slice[] = [];

  if (existsSync(slicesPath)) {
    const slicesData = JSON.parse(readFileSync(slicesPath, 'utf-8'));
    if (Array.isArray(slicesData)) {
      for (const sliceData of slicesData) {
        const slice = parseSlice(sliceData);
        slices.push(slice);
      }
    }
  }

  // Parse requirements.json within milestone if exists
  const milestoneReqsPath = join(milestonePath, 'requirements.json');
  const milestoneReqs: GSD2Requirement[] = [];
  if (existsSync(milestoneReqsPath)) {
    const reqsData = JSON.parse(readFileSync(milestoneReqsPath, 'utf-8'));
    if (Array.isArray(reqsData)) {
      milestoneReqs.push(...reqsData);
    }
  }

  return {
    id,
    title,
    vision: state.vision ?? state.description ?? '',
    slices,
    requirements: milestoneReqs,
  };
}

/**
 * Parse a slice from JSON data.
 */
function parseSlice(data: Record<string, unknown>): GSD2Slice {
  const tasks: GSD2Task[] = [];
  const tasksData = data.tasks as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(tasksData)) {
    for (const taskData of tasksData) {
      tasks.push(parseTask(taskData));
    }
  }

  const summary = data.summary
    ? (data.summary as GSD2SliceSummaryData)
    : null;

  return {
    id: (data.id as string) ?? 'S01',
    title: (data.title as string) ?? 'Untitled',
    risk: (data.risk as 'low' | 'medium' | 'high') ?? 'medium',
    depends: (data.depends as string[]) ?? [],
    done: (data.done as boolean) ?? false,
    demo: (data.demo as string) ?? '',
    goal: (data.goal as string) ?? '',
    tasks,
    summary,
  };
}

/**
 * Parse a task from JSON data.
 */
function parseTask(data: Record<string, unknown>): GSD2Task {
  const summary = data.summary
    ? (data.summary as GSD2TaskSummaryData)
    : null;

  return {
    id: (data.id as string) ?? 'T01',
    title: (data.title as string) ?? 'Untitled',
    description: (data.description as string) ?? '',
    done: (data.done as boolean) ?? false,
    estimate: (data.estimate as string) ?? '',
    files: (data.files as string[]) ?? [],
    mustHaves: (data.mustHaves as string[]) ?? [],
    summary,
  };
}
