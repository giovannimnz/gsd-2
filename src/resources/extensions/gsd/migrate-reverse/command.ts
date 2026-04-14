/**
 * /gsd from-gsd2 — reverse migration from .gsd/ (GSD-2) to .planning/ (v1)
 *
 * Reverses the /gsd migrate operation, converting projects
 * from the modern GSD-2 format back to v1 compatibility.
 */

import type { ExtensionAPI, ExtensionCommandContext } from "@gsd/pi-coding-agent";
import { existsSync, readFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gsdRoot } from "../paths.js";
import { showNextAction } from "../../shared/tui.js";
import {
  validateGSDDirectory,
  parseGSDDirectory,
  reverseTransformToV1,
  generateReversePreview,
  writePlanningDirectory,
} from "./index.js";
import type { ReverseMigrationPreview } from "./types.js";

/** Format preview stats for embedding in the review prompt. */
function formatPreviewStats(preview: ReverseMigrationPreview): string {
  const lines = [
    `- Milestones: ${preview.milestoneCount} → ${preview.phaseCount} phases`,
    `- Slices: ${preview.totalSlices} (${preview.doneSlices} done — ${preview.sliceCompletionPct}%)`,
    `- Tasks: ${preview.totalTasks} (${preview.doneTasks} done — ${preview.taskCompletionPct}%)`,
  ];
  if (preview.requirements.total > 0) {
    lines.push(
      `- Requirements: ${preview.requirements.total} (${preview.requirements.validated} validated, ${preview.requirements.active} active, ${preview.requirements.deferred} deferred)`,
    );
  }
  return lines.join('\n');
}

/** Load and interpolate the review prompt template for reverse migration. */
function buildReviewPrompt(
  sourcePath: string,
  planningPath: string,
  preview: ReverseMigrationPreview,
): string {
  const promptsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "prompts");
  const templatePath = join(promptsDir, "review-migration.md");
  let content = '';
  if (existsSync(templatePath)) {
    content = readFileSync(templatePath, 'utf-8');
  }

  content = content.replaceAll('{{sourcePath}}', sourcePath);
  content = content.replaceAll('{{gsdPath}}', planningPath);
  content = content.replaceAll('{{previewStats}}', formatPreviewStats(preview));

  return content.trim();
}

/** Dispatch the review prompt to the agent. */
function dispatchReview(
  pi: ExtensionAPI,
  sourcePath: string,
  planningPath: string,
  preview: ReverseMigrationPreview,
): void {
  const prompt = buildReviewPrompt(sourcePath, planningPath, preview);

  pi.sendMessage(
    {
      customType: "gsd-from-gsd2-review",
      content: prompt,
      display: false,
    },
    { triggerTurn: true },
  );
}

export async function handleFromGSD2(
  args: string,
  ctx: ExtensionCommandContext,
  pi: ExtensionAPI,
): Promise<void> {
  // ── Resolve source path ────────────────────────────────────────────────────
  let rawPath = args.trim() || ".";
  if (rawPath.startsWith("~/")) {
    rawPath = join(process.env.HOME ?? "~", rawPath.slice(2));
  } else if (rawPath === "~") {
    rawPath = process.env.HOME ?? "~";
  }

  let sourcePath = resolve(process.cwd(), rawPath);
  if (!sourcePath.endsWith(".gsd")) {
    sourcePath = join(sourcePath, ".gsd");
  }

  if (!existsSync(sourcePath)) {
    ctx.ui.notify(
      `Directory not found: ${sourcePath}\n\n` +
      'Reverse migration converts a .gsd/ directory (from GSD-2) into .planning/ format (v1).\n' +
      'If you are starting a new project, use /gsd:new-project instead.\n' +
      'If migrating, ensure the path contains a .gsd/ directory.',
      "error",
    );
    return;
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  const validation = await validateGSDDirectory(sourcePath);

  const warnings = validation.issues.filter((i) => i.severity === "warning");
  const fatals = validation.issues.filter((i) => i.severity === "fatal");

  for (const w of warnings) {
    ctx.ui.notify(`⚠ ${w.message} (${w.file})`, "warning");
  }
  for (const f of fatals) {
    ctx.ui.notify(`✖ ${f.message} (${f.file})`, "error");
  }

  if (!validation.valid) {
    ctx.ui.notify(
      "Reverse migration blocked — fix the fatal issues above before retrying.",
      "error",
    );
    return;
  }

  // ── Parse → Transform → Preview ───────────────────────────────────────────
  const parsed = await parseGSDDirectory(sourcePath);
  const projectName = 'project'; // Could extract from PROJECT.md
  const project = reverseTransformToV1(parsed, projectName);
  const preview = generateReversePreview(parsed);

  // ── Build preview text ─────────────────────────────────────────────────────
  const lines: string[] = [
    `Milestones: ${preview.milestoneCount} → ${preview.phaseCount} phases`,
    `Slices: ${preview.totalSlices} (${preview.doneSlices} done — ${preview.sliceCompletionPct}%)`,
    `Tasks: ${preview.totalTasks} (${preview.doneTasks} done — ${preview.taskCompletionPct}%)`,
  ];

  if (preview.requirements.total > 0) {
    lines.push(
      `Requirements: ${preview.requirements.total} (${preview.requirements.validated} validated, ${preview.requirements.active} active, ${preview.requirements.deferred} deferred)`,
    );
  }

  const targetPlanningExists = existsSync(join(process.cwd(), '.planning'));
  if (targetPlanningExists) {
    lines.push("");
    lines.push("⚠ A .planning directory already exists in the current working directory — it will be overwritten.");
  }

  // ── Confirmation via showNextAction ────────────────────────────────────────
  const choice = await showNextAction(ctx, {
    title: "Reverse Migration Preview",
    summary: lines,
    actions: [
      {
        id: "confirm",
        label: "Write .planning directory",
        description: `Migrate ${preview.milestoneCount} milestone(s) to ${process.cwd()}/.planning`,
        recommended: true,
      },
      {
        id: "cancel",
        label: "Cancel",
        description: "Exit without writing anything",
      },
    ],
    notYetMessage: "Run /gsd from-gsd2 again when ready.",
  });

  if (choice !== "confirm") {
    ctx.ui.notify("Reverse migration cancelled — no files were written.", "info");
    return;
  }

  // ── Write ──────────────────────────────────────────────────────────────────
  ctx.ui.notify("Writing .planning directory…", "info");

  const result = writePlanningDirectory(project, process.cwd());
  const planningPath = join(process.cwd(), '.planning');

  ctx.ui.notify(
    `✓ Reverse migration complete — ${result.paths.length} file(s) written to .planning/`,
    "info",
  );

  // ── Post-write review offer ────────────────────────────────────────────────
  const reviewChoice = await showNextAction(ctx, {
    title: "Reverse Migration Written",
    summary: [
      `${result.paths.length} files written to .planning/`,
      "",
      "The agent can now review the migrated output against GSD v1 standards —",
      "checking structure, content quality, and phase consistency.",
    ],
    actions: [
      {
        id: "review",
        label: "Review migration",
        description: "Agent audits the .planning output and reports PASS/FAIL per category",
        recommended: true,
      },
      {
        id: "skip",
        label: "Skip review",
        description: "Trust the migration output as-is",
      },
    ],
    notYetMessage: "Run /gsd from-gsd2 again to re-migrate, or review .planning manually.",
  });

  if (reviewChoice === "review") {
    dispatchReview(pi, sourcePath, planningPath, preview);
  }
}
