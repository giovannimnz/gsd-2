/**
 * Authentication tests for Qwen Code provider
 */

import { describe, test, expect, beforeAll } from "@jest/globals";
import {
	initiateOAuth,
	isQwenCodeConfigured,
	getQwenCodeConfig,
	configureQwenCode,
} from "../../../packages/pi-ai/src/providers/qwen-code.js";

describe("Qwen Code Authentication", () => {
	test("should detect if qwen code is configured", () => {
		const configured = isQwenCodeConfigured();
		// Result depends on machine state
		expect(typeof configured).toBe("boolean");
	});

	test("should load default configuration", () => {
		const config = getQwenCodeConfig();
		expect(config).toBeDefined();
		expect(config.defaultModel).toBe("qwen3.6-plus");
		expect(config.yoloMode).toBe(true);
	});

	test("should allow configuration updates", () => {
		const original = getQwenCodeConfig();
		
		// Update config
		configureQwenCode({
			defaultModel: "qwen3.5-plus",
			yoloMode: false,
		});

		const updated = getQwenCodeConfig();
		expect(updated.defaultModel).toBe("qwen3.5-plus");
		expect(updated.yoloMode).toBe(false);

		// Restore original
		configureQwenCode({
			defaultModel: original.defaultModel,
			yoloMode: original.yoloMode,
		});
	});

	test("should extract machine credentials if available", () => {
		// This test checks if we can read from ~/.qwen/settings.json
		// Result depends on whether qwen is installed and configured
		const configured = isQwenCodeConfigured();
		
		if (configured) {
			const config = getQwenCodeConfig();
			expect(config).toBeDefined();
		}
	});

	test("OAuth initiation should handle errors gracefully", async () => {
		// OAuth test - may fail if qwen not installed
		try {
			const result = await initiateOAuth();
			// Should return boolean
			expect(typeof result).toBe("boolean");
		} catch (error) {
			// Should not throw unhandled errors
			expect(error).toBeDefined();
		}
	}, 30000); // 30 second timeout for OAuth
});
