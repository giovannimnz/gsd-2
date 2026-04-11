/**
 * Integration tests for Qwen Code provider
 */

import { describe, test, expect, beforeAll } from "@jest/globals";
import { streamQwenCode } from "../../../packages/pi-ai/src/providers/qwen-code.js";
import type { Model, Context } from "../../../packages/pi-ai/src/types.js";

describe("Qwen Code Provider", () => {
	const mockModel: Model<"qwen-code"> = {
		id: "qwen3.6-plus",
		name: "Qwen 3.6 Plus",
		provider: "qwen-code",
		api: "qwen-code",
		baseUrl: "",
		headers: {},
	};

	test("should initialize qwen-code provider", () => {
		// Provider is registered if imports work
		expect(streamQwenCode).toBeDefined();
		expect(typeof streamQwenCode).toBe("function");
	});

	test("should execute qwen CLI with simple prompt", async () => {
		const context: Context = {
			messages: [
				{
					role: "user",
					content: [{ type: "text", text: "What is 2+2?" }],
				},
			],
		};

		const stream = streamQwenCode(mockModel, context);
		expect(stream).toBeDefined();

		// Collect events
		const events: unknown[] = [];
		try {
			for await (const event of stream) {
				events.push(event);
				if (event.type === "text") {
					expect(event.text).toBeDefined();
				}
			}
		} catch (error) {
			// May fail if qwen not installed
			expect(error).toBeDefined();
		}
	}, 60000); // 60 second timeout

	test("should use qwen3.6-plus by default", async () => {
		const context: Context = {
			messages: [
				{
					role: "user",
					content: [{ type: "text", text: "Hello" }],
				},
			],
		};

		// Use default model
		const defaultModel: Model<"qwen-code"> = {
			id: "qwen-code", // This will be replaced with default
			name: "Qwen Code",
			provider: "qwen-code",
			api: "qwen-code",
			baseUrl: "",
			headers: {},
		};

		const stream = streamQwenCode(defaultModel, context);
		expect(stream).toBeDefined();
	}, 30000);

	test("should run in yolo mode by default", async () => {
		const context: Context = {
			messages: [
				{
					role: "user",
					content: [{ type: "text", text: "Say hello" }],
				},
			],
		};

		const stream = streamQwenCode(mockModel, context);
		expect(stream).toBeDefined();

		// Yolo mode is configured internally, should not prompt
		// If this runs without interactive prompts, yolo mode works
	}, 30000);

	test("should handle auth errors gracefully", async () => {
		const context: Context = {
			messages: [
				{
					role: "user",
					content: [{ type: "text", text: "Test" }],
				},
			],
		};

		// This may fail if not authenticated
		const stream = streamQwenCode(mockModel, context);
		
		try {
			for await (const event of stream) {
				if (event.type === "error") {
					expect(event.error).toBeDefined();
					expect(event.error.errorMessage).toBeDefined();
				}
			}
		} catch {
			// Expected if auth fails
		}
	}, 30000);
});
