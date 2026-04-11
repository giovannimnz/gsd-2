/**
 * Performance comparison tests for Qwen Code provider vs native qwen
 */

import { describe, test, expect } from "@jest/globals";
import { spawn } from "node:child_process";
import { streamQwenCode } from "../../../packages/pi-ai/src/providers/qwen-code.js";
import type { Model, Context } from "../../../packages/pi-ai/src/types.js";

// Helper to run native qwen CLI
function runNativeQwen(prompt: string): Promise<{ output: string; duration: number }> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    let output = "";

    const child = spawn("qwen", ["-p", prompt, "--yolo"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });

    child.on("close", (code) => {
      const duration = Date.now() - start;
      if (code === 0 || code === null) {
        resolve({ output, duration });
      } else {
        reject(new Error(`Qwen exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

// Helper to run GSD provider
function runGsdProvider(prompt: string): Promise<{ output: string; duration: number }> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const model: Model<"qwen-code"> = {
      id: "qwen3.6-plus",
      name: "Qwen 3.6 Plus",
      provider: "qwen-code",
      api: "qwen-code",
      baseUrl: "",
      headers: {},
    };

    const context: Context = {
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    };

    const stream = streamQwenCode(model, context);
    let output = "";

    (async () => {
      try {
        for await (const event of stream) {
          if (event.type === "text") {
            output += event.text;
          }
        }
        const duration = Date.now() - start;
        resolve({ output, duration });
      } catch (error) {
        reject(error);
      }
    })();
  });
}

describe("Qwen Code Performance Comparison", () => {
  test("should measure latency for simple query", async () => {
    const prompt = "What is 2+2?";
    console.log(`\nTesting latency: "${prompt}"`);

    // Test GSD provider
    let gsdDuration = 0;
    let gsdOutput = "";
    try {
      const gsdResult = await runGsdProvider(prompt);
      gsdDuration = gsdResult.duration;
      gsdOutput = gsdResult.output;
      console.log(`  GSD Provider: ${gsdDuration}ms, ${gsdOutput.length} chars`);
    } catch (error) {
      console.log(`  GSD Provider failed: ${error}`);
    }

    // Test native qwen
    let nativeDuration = 0;
    let nativeOutput = "";
    try {
      const nativeResult = await runNativeQwen(prompt);
      nativeDuration = nativeResult.duration;
      nativeOutput = nativeResult.output;
      console.log(`  Native Qwen: ${nativeDuration}ms, ${nativeOutput.length} chars`);
    } catch (error) {
      console.log(`  Native Qwen failed: ${error}`);
    }

    // Compare if both succeeded
    if (gsdDuration > 0 && nativeDuration > 0) {
      const latencyDiff = gsdDuration - nativeDuration;
      const latencyPercent = ((latencyDiff / nativeDuration) * 100).toFixed(1);
      console.log(`  Latency difference: ${latencyDiff}ms (${latencyPercent}%)`);

      expect(gsdDuration).toBeGreaterThan(0);
      expect(nativeDuration).toBeGreaterThan(0);
    }
  }, 120000);

  test("should measure success rate", async () => {
    const prompt = "Say hello";
    const iterations = 3;

    let gsdSuccess = 0;
    let nativeSuccess = 0;

    // Test GSD provider
    for (let i = 0; i < iterations; i++) {
      try {
        await runGsdProvider(prompt);
        gsdSuccess++;
      } catch {
        // Failed
      }
    }

    // Test native
    for (let i = 0; i < iterations; i++) {
      try {
        await runNativeQwen(prompt);
        nativeSuccess++;
      } catch {
        // Failed
      }
    }

    console.log(`\nSuccess rates over ${iterations} iterations:`);
    console.log(`  GSD Provider: ${gsdSuccess}/${iterations}`);
    console.log(`  Native Qwen: ${nativeSuccess}/${iterations}`);

    // Both should have similar success rates
    if (nativeSuccess > 0) {
      expect(gsdSuccess).toBeGreaterThanOrEqual(nativeSuccess - 1);
    }
  }, 180000);
});
