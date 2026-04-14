/**
 * Validator for reverse migration (.gsd/ → .planning/)
 *
 * Pre-flight checks to ensure the .gsd/ directory is valid for reverse migration.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import type { ValidationResult } from '../migrate/types.js';

/**
 * Validate that the .gsd/ directory exists and has the expected structure.
 */
export function validateGSDDirectory(sourcePath: string): ValidationResult {
  const issues: Array<{ file: string; severity: 'fatal' | 'warning'; message: string }> = [];

  // Check .gsd directory exists
  if (!existsSync(sourcePath)) {
    issues.push({
      file: '.gsd/',
      severity: 'fatal',
      message: `GSD directory not found at ${sourcePath}`,
    });
    return { valid: false, issues };
  }

  // Check for required files
  const requiredFiles = ['PROJECT.md', 'ROADMAP.md'];
  for (const file of requiredFiles) {
    const filePath = join(sourcePath, file);
    if (!existsSync(filePath)) {
      issues.push({
        file,
        severity: 'warning',
        message: `${file} not found — migration will proceed with defaults`,
      });
    }
  }

  // Check for milestone directories (M001-*, M002-*, etc.)
  const entries = readdirSync(sourcePath);
  const milestoneDirs = entries.filter((e) => /^M\d{3}-/.test(e));

  if (milestoneDirs.length === 0) {
    issues.push({
      file: '.gsd/',
      severity: 'fatal',
      message: 'No milestone directories found (expected M001-*, M002-*, etc.)',
    });
  }

  // Check each milestone has at least a state.json or slices.json
  for (const milestone of milestoneDirs) {
    const milestonePath = join(sourcePath, milestone);
    const hasState = existsSync(join(milestonePath, 'state.json'));
    const hasSlices = existsSync(join(milestonePath, 'slices.json'));

    if (!hasState && !hasSlices) {
      issues.push({
        file: `${milestone}/`,
        severity: 'warning',
        message: `No state.json or slices.json found in ${milestone}`,
      });
    }
  }

  const valid = issues.filter((i) => i.severity === 'fatal').length === 0;
  return { valid, issues };
}
