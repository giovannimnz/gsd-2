/**
 * Qwen Code CLI provider.
 * 
 * Integrates Qwen Code CLI (https://github.com/QwenLM/qwen-code) as a provider
 * for the GSD system. Supports OAuth authentication, yolo-mode execution,
 * and configurable model selection (default: qwen3.6-plus).
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { calculateCost } from "../models.js";
import type {
	Api,
	AssistantMessage,
	Context,
	Model,
	SimpleStreamOptions,
	StreamFunction,
	TextContent,
} from "../types.js";
import { AssistantMessageEventStream } from "../utils/event-stream.js";

/**
 * Qwen Code configuration stored in GSD agent directory
 */
interface QwenCodeConfig {
	/** OAuth token from qwen.ai */
	accessToken?: string;
	/** Token expiry timestamp */
	expiresAt?: number;
	/** Refresh token for OAuth */
	refreshToken?: string;
	/** Default model to use */
	defaultModel?: string;
	/** Whether yolo mode is enabled */
	yoloMode?: boolean;
	/** Path to qwen CLI executable */
	cliPath?: string;
}

const GSD_AGENT_DIR = join(homedir(), ".gsd", "agent");
const QWEN_CODE_CONFIG_PATH = join(GSD_AGENT_DIR, "qwen-code-config.json");
const QWEN_MACHINE_CONFIG_PATH = join(homedir(), ".qwen", "settings.json");

/**
 * Default configuration for Qwen Code provider
 */
const DEFAULT_CONFIG: QwenCodeConfig = {
	defaultModel: "qwen3.6-plus",
	yoloMode: true,
	cliPath: "qwen",
};

/**
 * Load Qwen Code configuration from GSD config directory
 */
function loadConfig(): QwenCodeConfig {
	if (existsSync(QWEN_CODE_CONFIG_PATH)) {
		try {
			const content = readFileSync(QWEN_CODE_CONFIG_PATH, "utf-8");
			const saved = JSON.parse(content) as QwenCodeConfig;
			return { ...DEFAULT_CONFIG, ...saved };
		} catch {
			// Fall through to defaults
		}
	}
	return { ...DEFAULT_CONFIG };
}

/**
 * Save Qwen Code configuration to GSD config directory
 */
function saveConfig(config: QwenCodeConfig): void {
	const dir = dirname(QWEN_CODE_CONFIG_PATH);
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	writeFileSync(QWEN_CODE_CONFIG_PATH, JSON.stringify(config, null, 2));
}

/**
 * Check if Qwen Code CLI is available and configured
 */
function isQwenCodeAvailable(): boolean {
	// Check if qwen CLI is in PATH
	try {
		const { execSync } = require("node:child_process");
		execSync("which qwen", { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

/**
 * Try to extract credentials from machine's qwen installation
 */
function extractMachineCredentials(): { apiKey?: string; baseUrl?: string } | null {
	if (!existsSync(QWEN_MACHINE_CONFIG_PATH)) {
		return null;
	}

	try {
		const content = readFileSync(QWEN_MACHINE_CONFIG_PATH, "utf-8");
		const config = JSON.parse(content);

		// Check for API key in settings
		if (config.env?.DASHSCOPE_API_KEY) {
			return {
				apiKey: config.env.DASHSCOPE_API_KEY,
				baseUrl: config.modelProviders?.openai?.[0]?.baseUrl ||
					"https://dashscope.aliyuncs.com/compatible-mode/v1",
			};
		}

		// Check for other API keys
		if (config.env?.BAILIAN_CODING_PLAN_API_KEY) {
			return {
				apiKey: config.env.BAILIAN_CODING_PLAN_API_KEY,
				baseUrl: "https://coding.dashscope.aliyuncs.com/v1",
			};
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Initiate OAuth flow for Qwen Code
 * Opens browser for authentication and captures token
 */
export async function initiateOAuth(): Promise<boolean> {
	try {
		// Start qwen CLI and run /auth command
		const child = spawn("qwen", [], {
			stdio: ["pipe", "pipe", "pipe"],
			detached: false,
		});

		let output = "";
		child.stdout.on("data", (data: Buffer) => {
			output += data.toString();
		});

		// Send /auth command
		child.stdin.write("/auth\n");

		// Wait a bit for OAuth flow to initiate
		await new Promise((resolve) => setTimeout(resolve, 5000));

		// Send exit command
		child.stdin.write("/exit\n");

		// Wait for process to finish
		await new Promise<void>((resolve) => {
			child.on("close", () => resolve());
			// Timeout after 30 seconds
			setTimeout(() => {
				child.kill();
				resolve();
			}, 30000);
		});

		// Check if authentication was successful by checking machine config
		const machineCreds = extractMachineCredentials();
		if (machineCreds) {
			const config = loadConfig();
			config.accessToken = machineCreds.apiKey;
			saveConfig(config);
			return true;
		}

		return false;
	} catch (error) {
		console.error("OAuth initiation failed:", error);
		return false;
	}
}

/**
 * Build qwen CLI command with appropriate arguments
 */
function buildQwenCommand(
	prompt: string,
	model: string,
	config: QwenCodeConfig,
): { command: string; args: string[]; env: Record<string, string> } {
	const args: string[] = ["-p", prompt];

	// Add yolo mode if enabled
	if (config.yoloMode !== false) {
		args.push("--yolo");
	}

	// Add model if specified
	if (model && model !== "qwen-code") {
		args.push("--model", model);
	}

	// Environment variables
	const env: Record<string, string> = { ...process.env as Record<string, string> };

	// Try to extract machine credentials
	const machineCreds = extractMachineCredentials();
	if (machineCreds?.apiKey) {
		env.DASHSCOPE_API_KEY = machineCreds.apiKey;
	}

	// If we have stored access token, use it
	if (config.accessToken) {
		env.DASHSCOPE_API_KEY = config.accessToken;
	}

	return {
		command: config.cliPath || "qwen",
		args,
		env,
	};
}

/**
 * Stream completion using Qwen Code CLI
 */
export const streamQwenCode: StreamFunction<"qwen-code"> = (
	model: Model<"qwen-code">,
	context: Context,
	options?: SimpleStreamOptions,
): AssistantMessageEventStream => {
	const stream = new AssistantMessageEventStream();

	(async () => {
		try {
			// Load configuration
			const config = loadConfig();

			// Check if qwen is available
			if (!isQwenCodeAvailable()) {
				throw new Error(
					"Qwen Code CLI not found. Please install it: npm install -g @qwen-code/qwen-code",
				);
			}

			// Extract prompt from context
			const userMessage = context.messages.find((m) => m.role === "user");
			const prompt = typeof userMessage?.content === "string" 
				? userMessage.content
				: Array.isArray(userMessage?.content)
					? (userMessage.content as TextContent[])
						.filter((c): c is TextContent => c.type === "text")
						.map((c) => c.text)
						.join("\n")
					: "Hello";

			// Build command
			const { command, args, env } = buildQwenCommand(
				prompt,
				model.id === "qwen-code" ? config.defaultModel || "qwen3.6-plus" : model.id,
				config,
			);

			// Spawn qwen process
			const child = spawn(command, args, {
				env,
				stdio: ["ignore", "pipe", "pipe"],
			});

			let output = "";
			let errorOutput = "";

			// Create partial message for events
			const partialMessage: AssistantMessage = {
				role: "assistant",
				content: [],
				api: "qwen-code",
				provider: model.provider,
				model: model.id,
				usage: {
					input: prompt.length,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: prompt.length,
					cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
				},
				stopReason: "stop",
				timestamp: Date.now(),
			};

			child.stdout.on("data", (data: Buffer) => {
				const chunk = data.toString();
				output += chunk;
				
				// Update partial message
				partialMessage.content = [{ type: "text", text: output }];
				partialMessage.usage.output = output.length;
				partialMessage.usage.totalTokens = partialMessage.usage.input + output.length;
				
				// Push text delta event
				stream.push({
					type: "text_delta",
					contentIndex: 0,
					delta: chunk,
					partial: partialMessage,
				});
			});

			child.stderr.on("data", (data: Buffer) => {
				errorOutput += data.toString();
			});

			// Handle completion
			child.on("close", (code) => {
				if (code !== 0 && code !== null) {
					const error: AssistantMessage = {
						role: "assistant",
						content: [],
						api: "qwen-code",
						provider: model.provider,
						model: model.id,
						usage: {
							input: prompt.length,
							output: 0,
							cacheRead: 0,
							cacheWrite: 0,
							totalTokens: prompt.length,
							cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
						},
						stopReason: "error",
						errorMessage: `Qwen Code exited with code ${code}: ${errorOutput || "Unknown error"}`,
						timestamp: Date.now(),
					};
					stream.end(error);
				} else {
					// Calculate approximate usage
					const inputTokens = prompt.length;
					const outputTokens = output.length;
					
					const message: AssistantMessage = {
						role: "assistant",
						content: [{ type: "text", text: output }],
						api: "qwen-code",
						provider: model.provider,
						model: model.id,
						usage: {
							input: inputTokens,
							output: outputTokens,
							cacheRead: 0,
							cacheWrite: 0,
							totalTokens: inputTokens + outputTokens,
							cost: calculateCost(model, {
							input: inputTokens,
							output: outputTokens,
							cacheRead: 0,
							cacheWrite: 0,
							totalTokens: inputTokens + outputTokens,
							cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
						}),
						},
						stopReason: "stop",
						timestamp: Date.now(),
					};
					stream.end(message);
				}
			});

			// Handle abort signal
			if (options?.signal) {
				options.signal.addEventListener("abort", () => {
					child.kill();
					const abortMessage: AssistantMessage = {
						role: "assistant",
						content: [{ type: "text", text: output }],
						api: "qwen-code",
						provider: model.provider,
						model: model.id,
						usage: {
							input: prompt.length,
							output: output.length,
							cacheRead: 0,
							cacheWrite: 0,
							totalTokens: prompt.length + output.length,
							cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
						},
						stopReason: "aborted",
						timestamp: Date.now(),
					};
					stream.end(abortMessage);
				});
			}
		} catch (error) {
			const errorMessage: AssistantMessage = {
				role: "assistant",
				content: [],
				api: "qwen-code",
				provider: model.provider,
				model: model.id,
				usage: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: 0,
					cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
				},
				stopReason: "error",
				errorMessage: error instanceof Error ? error.message : String(error),
				timestamp: Date.now(),
			};
			stream.end(errorMessage);
		}
	})();

	return stream;
};

/**
 * Simple stream completion using Qwen Code CLI
 * Simplified version for basic use cases
 */
export const streamSimpleQwenCode = streamQwenCode;

/**
 * Configure Qwen Code provider
 * Allows setting default model, yolo mode, and OAuth credentials
 */
export function configureQwenCode(config: Partial<QwenCodeConfig>): void {
	const current = loadConfig();
	saveConfig({ ...current, ...config });
}

/**
 * Get current Qwen Code configuration
 */
export function getQwenCodeConfig(): QwenCodeConfig {
	return loadConfig();
}

/**
 * Check if Qwen Code is properly configured and available
 */
export function isQwenCodeConfigured(): boolean {
	if (!isQwenCodeAvailable()) {
		return false;
	}

	const config = loadConfig();

	// Check if we have any authentication method
	if (config.accessToken) {
		return true;
	}

	// Check for machine credentials
	const machineCreds = extractMachineCredentials();
	if (machineCreds?.apiKey) {
		return true;
	}

	// Check for environment variable
	if (process.env.DASHSCOPE_API_KEY) {
		return true;
	}

	return false;
}
