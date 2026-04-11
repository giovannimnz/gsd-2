/**
 * Qwen Code OAuth flow
 * Uses Qwen CLI's built-in authentication
 */

import type { OAuthCredentials, OAuthLoginCallbacks, OAuthProviderInterface } from "./types.js";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const QWEN_MACHINE_CONFIG_PATH = join(homedir(), ".qwen", "settings.json");

/**
 * Check if Qwen CLI is authenticated
 */
function isQwenAuthenticated(): boolean {
	// Check for machine credentials
	if (existsSync(QWEN_MACHINE_CONFIG_PATH)) {
		try {
			const content = readFileSync(QWEN_MACHINE_CONFIG_PATH, "utf-8");
			const config = JSON.parse(content);
			if (config.env?.DASHSCOPE_API_KEY || config.env?.BAILIAN_CODING_PLAN_API_KEY) {
				return true;
			}
		} catch {
			// Fall through
		}
	}

	// Check for environment variable
	if (process.env.DASHSCOPE_API_KEY) {
		return true;
	}

	return false;
}

/**
 * Get Qwen API key
 */
function getQwenApiKey(): string {
	// Check for machine credentials
	if (existsSync(QWEN_MACHINE_CONFIG_PATH)) {
		try {
			const content = readFileSync(QWEN_MACHINE_CONFIG_PATH, "utf-8");
			const config = JSON.parse(content);
			if (config.env?.DASHSCOPE_API_KEY) {
				return config.env.DASHSCOPE_API_KEY;
			}
			if (config.env?.BAILIAN_CODING_PLAN_API_KEY) {
				return config.env.BAILIAN_CODING_PLAN_API_KEY;
			}
		} catch {
			// Fall through
		}
	}

	// Check for environment variable
	if (process.env.DASHSCOPE_API_KEY) {
		return process.env.DASHSCOPE_API_KEY;
	}

	return "<authenticated>";
}

/**
 * Qwen Code OAuth Provider
 */
export const qwenCodeOAuthProvider: OAuthProviderInterface = {
	id: "qwen-code",
	name: "Qwen Code",
	usesCallbackServer: false,

	getApiKey(credentials: OAuthCredentials): string {
		return credentials.access || getQwenApiKey();
	},

	async login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials> {
		const { onProgress, onAuth } = callbacks;

		onProgress?.("Starting Qwen Code authentication...");

		// Check if already authenticated
		if (isQwenAuthenticated()) {
			onProgress?.("Already authenticated with Qwen Code");
			return {
				access: getQwenApiKey(),
				refresh: "",
				expires: Date.now() + 86400000 * 30, // 30 days
			};
		}

		// Use onAuth to provide instructions
		onAuth({
			url: "qwen",
			instructions: "Please run 'qwen' in a terminal, then type '/auth' and complete the OAuth flow in your browser. After authentication, press Enter here to continue.",
		});

		// Wait for user confirmation
		await new Promise<void>((resolve) => {
			setTimeout(resolve, 5000); // Give user time to read
		});

		// Poll for authentication
		for (let i = 0; i < 60; i++) {
			if (isQwenAuthenticated()) {
				onProgress?.("Authentication successful!");
				return {
					access: getQwenApiKey(),
					refresh: "",
					expires: Date.now() + 86400000 * 30, // 30 days
				};
			}
			await new Promise((r) => setTimeout(r, 1000));
			onProgress?.("Waiting for authentication...");
		}

		throw new Error("Authentication timeout - please try again");
	},

	async refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials> {
		if (isQwenAuthenticated()) {
			return {
				...credentials,
				access: getQwenApiKey(),
				expires: Date.now() + 86400000 * 30, // 30 days
			};
		}
		throw new Error("Not authenticated with Qwen Code");
	},
};

/**
 * Login to Qwen Code (legacy export)
 */
export async function loginQwenCode(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials> {
	return qwenCodeOAuthProvider.login(callbacks);
}

/**
 * Refresh Qwen Code token (legacy export)
 */
export async function refreshQwenCodeToken(credentials: OAuthCredentials): Promise<OAuthCredentials> {
	return qwenCodeOAuthProvider.refreshToken(credentials);
}
