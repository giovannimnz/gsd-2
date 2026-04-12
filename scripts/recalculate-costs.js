#!/usr/bin/env node
/**
 * Recalculate costs for existing metrics.
 * Reads .gsd/metrics.json, recalculates costs based on current model prices,
 * and writes the updated file back.
 *
 * Usage: node scripts/recalculate-costs.js [project-path]
 * Example: node scripts/recalculate-costs.js /home/ubuntu/GitHub/atius
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Hardcoded cost table (from model-cost-table.ts)
const BUNDLED_COST_TABLE = [
  { id: "claude-opus-4-6", inputPer1k: 0.005, outputPer1k: 0.025 },
  { id: "claude-sonnet-4-6", inputPer1k: 0.003, outputPer1k: 0.015 },
  { id: "claude-haiku-4-5", inputPer1k: 0.001, outputPer1k: 0.005 },
  { id: "gpt-4o", inputPer1k: 0.0025, outputPer1k: 0.01 },
  { id: "gpt-4o-mini", inputPer1k: 0.00015, outputPer1k: 0.0006 },
  { id: "gpt-5", inputPer1k: 0.00125, outputPer1k: 0.01 },
  { id: "gpt-5.3-codex", inputPer1k: 0.00175, outputPer1k: 0.014 },
  { id: "gpt-5.3-codex-spark", inputPer1k: 0.0003, outputPer1k: 0.0012 },
  { id: "gpt-5.4", inputPer1k: 0.0025, outputPer1k: 0.015 },
  { id: "copilot-gpt-5.3-codex", inputPer1k: 0.00175, outputPer1k: 0.014 },
  { id: "copilot-gpt-5.4", inputPer1k: 0.0025, outputPer1k: 0.015 },
  { id: "deepseek-chat", inputPer1k: 0.00032, outputPer1k: 0.00089 },
  { id: "grok-code-fast-1", inputPer1k: 0.0002, outputPer1k: 0.0015 },
];

function lookupModelCost(modelId) {
  const bareId = modelId.includes('/') ? modelId.split('/').pop() : modelId;
  return BUNDLED_COST_TABLE.find(e => e.id === bareId)
    ?? BUNDLED_COST_TABLE.find(e => bareId.includes(e.id) || e.id.includes(bareId));
}

function recalculateCost(modelId, tokens) {
  const costEntry = lookupModelCost(modelId);
  if (!costEntry) {
    console.warn(`  ⚠ No cost entry for model: ${modelId} (using bare ID: ${modelId.includes('/') ? modelId.split('/').pop() : modelId})`);
    return 0;
  }

  const inputCost = costEntry.inputPer1k * (tokens.input / 1000);
  const outputCost = costEntry.outputPer1k * (tokens.output / 1000);
  // Cache read is typically 10% of input cost
  const cacheReadCost = (costEntry.inputPer1k * 0.1) * (tokens.cacheRead / 1000);
  const cacheWriteCost = 0;

  return inputCost + outputCost + cacheReadCost + cacheWriteCost;
}

// Main
const projectDir = process.argv[2];
if (!projectDir) {
  console.error('Usage: node scripts/recalculate-costs.js [project-path]');
  console.error('Example: node scripts/recalculate-costs.js /home/ubuntu/GitHub/atius');
  process.exit(1);
}

const metricsPath = join(projectDir, '.gsd/metrics.json');

console.log(`📊 Recalculating costs for: ${metricsPath}`);

const metrics = JSON.parse(readFileSync(metricsPath, 'utf-8'));
let totalCostBefore = 0;
let totalCostAfter = 0;
let unitsUpdated = 0;
let unitsWithNoCost = 0;

for (const unit of metrics.units) {
  const oldCost = unit.cost || 0;
  totalCostBefore += oldCost;

  if (unit.model && unit.tokens) {
    const newCost = recalculateCost(unit.model, unit.tokens);
    if (newCost > 0) {
      unit.cost = Math.round(newCost * 10000) / 10000;
      totalCostAfter += newCost;
      unitsUpdated++;
    } else {
      unitsWithNoCost++;
    }
  }
}

// Write updated metrics
writeFileSync(metricsPath, JSON.stringify(metrics, null, 2) + '\n', 'utf-8');

console.log(`\n✅ Results:`);
console.log(`   Units updated: ${unitsUpdated}`);
console.log(`   Units with no cost entry: ${unitsWithNoCost}`);
console.log(`   💰 Cost before: $${totalCostBefore.toFixed(2)}`);
console.log(`   💰 Cost after:  $${totalCostAfter.toFixed(2)}`);
console.log(`   📈 Difference:  $${(totalCostAfter - totalCostBefore).toFixed(2)}`);
console.log(`\n⚡ Refresh your GSD web dashboard to see the updated costs!`);
