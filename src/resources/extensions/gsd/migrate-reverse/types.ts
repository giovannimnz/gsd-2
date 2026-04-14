// GSD-2 → v1 Reverse Migration Types
// Defines the contract for transforming .gsd/ (GSD-2 format) back to .planning/ (v1 format).

// ─── GSD-2 Input Types (read from .gsd/) ────────────────────────────────────

export interface GSD2Project {
  milestones: GSD2Milestone[];
  requirements: GSD2Requirement[];
}

export interface GSD2Milestone {
  id: string;       // "M001"
  title: string;
  vision: string;
  slices: GSD2Slice[];
  requirements: GSD2Requirement[];
}

export interface GSD2Slice {
  id: string;       // "S01"
  title: string;
  risk: 'low' | 'medium' | 'high';
  depends: string[];
  done: boolean;
  demo: string;
  goal: string;
  tasks: GSD2Task[];
  summary: GSD2SliceSummaryData | null;
}

export interface GSD2Task {
  id: string;       // "T01"
  title: string;
  description: string;
  done: boolean;
  estimate: string;
  files: string[];
  mustHaves: string[];
  summary: GSD2TaskSummaryData | null;
}

export interface GSD2Requirement {
  id: string;       // "R001"
  title: string;
  class: string;
  status: string;
  description: string;
  source: string;
  primarySlice: string;
}

export interface GSD2SliceSummaryData {
  completedAt: string;
  provides: string[];
  keyFiles: string[];
  keyDecisions: string[];
  patternsEstablished: string[];
  duration: string;
  whatHappened: string;
}

export interface GSD2TaskSummaryData {
  completedAt: string;
  provides: string[];
  keyFiles: string[];
  duration: string;
  whatHappened: string;
}

// ─── v1 Output Types (write to .planning/) ──────────────────────────────────

export interface PlanningV1Project {
  path: string;
  roadmap: string;            // ROADMAP.md content
  requirements: string;       // REQUIREMENTS.md content
  state: string;              // STATE.md content
  config: PlanningV1Config;   // config.json
  phases: PlanningV1Phase[];
}

export interface PlanningV1Config {
  projectName: string;
  [key: string]: unknown;
}

export interface PlanningV1Phase {
  number: number;
  slug: string;
  title: string;
  plans: PlanningV1Plan[];
  summaries: PlanningV1Summary[];
  done: boolean;
}

export interface PlanningV1Plan {
  planNumber: string;         // "01"
  fileName: string;           // "29-01-PLAN.md"
  frontmatter: PlanningV1PlanFrontmatter;
  objective: string;
  tasks: string[];
  context: string;
  verification: string;
  successCriteria: string;
}

export interface PlanningV1PlanFrontmatter {
  phase: string;
  plan: string;
  type: string;
  wave: number | null;
  depends_on: string[];
  files_modified: string[];
  autonomous: boolean;
  must_haves: PlanningV1PlanMustHaves | null;
}

export interface PlanningV1PlanMustHaves {
  truths: string[];
  artifacts: string[];
  key_links: string[];
}

export interface PlanningV1Summary {
  planNumber: string;
  fileName: string;
  frontmatter: PlanningV1SummaryFrontmatter;
  body: string;
}

export interface PlanningV1SummaryFrontmatter {
  phase: string;
  plan: string;
  subsystem: string;
  tags: string[];
  requires: PlanningV1SummaryRequires[];
  provides: string[];
  affects: string[];
  'tech-stack': string[];
  'key-files': string[];
  'key-decisions': string[];
  'patterns-established': string[];
  duration: string;
  completed: string;
}

export interface PlanningV1SummaryRequires {
  phase: string;
  provides: string;
}

// ─── Reverse Migration Preview ──────────────────────────────────────────────

export interface ReverseMigrationPreview {
  milestoneCount: number;
  totalSlices: number;
  doneSlices: number;
  sliceCompletionPct: number;
  totalTasks: number;
  doneTasks: number;
  taskCompletionPct: number;
  requirements: {
    total: number;
    validated: number;
    active: number;
    deferred: number;
  };
  phaseCount: number;
}
