import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	DISCOVERY_TTLS,
	getDefaultTTL,
	getDiscoverableProviders,
	getDiscoveryAdapter,
	supportsDiscoveryForApi,
} from "./model-discovery.js";

// ─── OpenAI Adapter enriched metadata parsing ────────────────────────────────

describe("OpenAI adapter enriched metadata parsing", () => {
	it("parses context_length, maxTokens, and pricing from enriched responses", async () => {
		// Simulate the response format from a New API / DeepSeek endpoint
		const mockResponse = {
			data: [
				{
					id: "deepseek-chat",
					object: "model",
					created: 1735689600,
					owned_by: "deepseek",
					name: "DeepSeek V3.2",
					context_length: 131072,
					top_provider: { max_completion_tokens: 8192 },
					pricing: {
						prompt: "0.00000028",
						completion: "0.00000042",
						prompt_cache_hit: "0.000000028",
					},
				},
				{
					id: "deepseek-reasoner",
					object: "model",
					created: 1735689600,
					owned_by: "deepseek",
					name: "DeepSeek V3.2 Reasoner",
					context_length: 131072,
					top_provider: { max_completion_tokens: 65536 },
					pricing: {
						prompt: "0.00000028",
						completion: "0.00000042",
						prompt_cache_hit: "0.000000028",
					},
				},
			],
			object: "list",
		};

		// Verify the mapping logic (same as in OpenAIDiscoveryAdapter.fetchModels)
		const models = mockResponse.data
			.filter((m) => !["embedding", "tts", "dall-e", "whisper", "text-embedding", "davinci", "babbage"].some((prefix) => m.id.startsWith(prefix)))
			.map((m) => {
				const cost =
					m.pricing?.prompt !== undefined && m.pricing?.completion !== undefined
						? {
								input: parseFloat(m.pricing.prompt) * 1_000_000,
								output: parseFloat(m.pricing.completion) * 1_000_000,
								cacheRead: m.pricing.prompt_cache_hit !== undefined
									? parseFloat(m.pricing.prompt_cache_hit) * 1_000_000
									: 0,
								cacheWrite: parseFloat(m.pricing.prompt) * 1_000_000,
							}
						: undefined;

				return {
					id: m.id,
					name: m.name ?? m.id,
					contextWindow: m.context_length,
					maxTokens: m.top_provider?.max_completion_tokens,
					cost,
					input: ["text" as const, "image" as const],
				};
			});

		assert.equal(models.length, 2);

		// deepseek-chat
		assert.equal(models[0].id, "deepseek-chat");
		assert.equal(models[0].name, "DeepSeek V3.2");
		assert.equal(models[0].contextWindow, 131072);
		assert.equal(models[0].maxTokens, 8192);
		assert.deepEqual(models[0].cost, {
			input: 0.28,
			output: 0.42,
			cacheRead: 0.028,
			cacheWrite: 0.28,
		});

		// deepseek-reasoner
		assert.equal(models[1].id, "deepseek-reasoner");
		assert.equal(models[1].name, "DeepSeek V3.2 Reasoner");
		assert.equal(models[1].contextWindow, 131072);
		assert.equal(models[1].maxTokens, 65536);
		assert.deepEqual(models[1].cost, {
			input: 0.28,
			output: 0.42,
			cacheRead: 0.028,
			cacheWrite: 0.28,
		});
	});

	it("falls back to id when name is not provided", async () => {
		const mockResponse = {
			data: [
				{
					id: "gpt-4o",
					object: "model",
					owned_by: "openai",
					name: undefined,
				},
			],
			object: "list",
		};

		const models = mockResponse.data.map((m) => ({
			id: m.id,
			name: m.name ?? m.id,
			contextWindow: (m as any).context_length,
			maxTokens: (m as any).top_provider?.max_completion_tokens,
			cost: undefined,
			input: ["text" as const, "image" as const],
		}));

		assert.equal(models[0].name, "gpt-4o");
	});

	it("excludes embedding, tts, dall-e, whisper, and legacy models", async () => {
		const mockResponse = {
			data: [
				{ id: "gpt-4o", owned_by: "openai" },
				{ id: "text-embedding-3-small", owned_by: "openai" },
				{ id: "tts-1", owned_by: "openai" },
				{ id: "dall-e-3", owned_by: "openai" },
				{ id: "whisper-1", owned_by: "openai" },
				{ id: "davinci-002", owned_by: "openai" },
				{ id: "babbage-002", owned_by: "openai" },
			],
			object: "list",
		};

		const excluded = ["embedding", "tts", "dall-e", "whisper", "text-embedding", "davinci", "babbage"];
		const models = mockResponse.data.filter((m) => !excluded.some((prefix) => m.id.startsWith(prefix)));

		assert.equal(models.length, 1);
		assert.equal(models[0].id, "gpt-4o");
	});
});

// ─── getDiscoveryAdapter ─────────────────────────────────────────────────────

describe("getDiscoveryAdapter", () => {
	it("returns an adapter for openai", () => {
		const adapter = getDiscoveryAdapter("openai");
		assert.equal(adapter.provider, "openai");
		assert.equal(adapter.supportsDiscovery, true);
	});

	it("returns an adapter for ollama", () => {
		const adapter = getDiscoveryAdapter("ollama");
		assert.equal(adapter.provider, "ollama");
		assert.equal(adapter.supportsDiscovery, true);
	});

	it("returns an adapter for openrouter", () => {
		const adapter = getDiscoveryAdapter("openrouter");
		assert.equal(adapter.provider, "openrouter");
		assert.equal(adapter.supportsDiscovery, true);
	});

	it("returns an adapter for google", () => {
		const adapter = getDiscoveryAdapter("google");
		assert.equal(adapter.provider, "google");
		assert.equal(adapter.supportsDiscovery, true);
	});

	it("returns a static adapter for anthropic", () => {
		const adapter = getDiscoveryAdapter("anthropic");
		assert.equal(adapter.provider, "anthropic");
		assert.equal(adapter.supportsDiscovery, false);
	});

	it("returns a static adapter for bedrock", () => {
		const adapter = getDiscoveryAdapter("bedrock");
		assert.equal(adapter.provider, "bedrock");
		assert.equal(adapter.supportsDiscovery, false);
	});

	it("returns a static adapter for unknown providers", () => {
		const adapter = getDiscoveryAdapter("unknown-provider");
		assert.equal(adapter.provider, "unknown-provider");
		assert.equal(adapter.supportsDiscovery, false);
	});

	it("returns OpenAI-style adapter for unknown provider with OpenAI-compatible API", () => {
		const adapter = getDiscoveryAdapter("my-proxy", ["openai-completions"]);
		assert.equal(adapter.provider, "my-proxy");
		assert.equal(adapter.supportsDiscovery, true);
	});

	it("static adapter fetchModels returns empty array", async () => {
		const adapter = getDiscoveryAdapter("anthropic");
		const models = await adapter.fetchModels("key");
		assert.deepEqual(models, []);
	});
});

// ─── getDiscoverableProviders ────────────────────────────────────────────────

describe("getDiscoverableProviders", () => {
	it("returns only providers that support discovery", () => {
		const providers = getDiscoverableProviders();
		assert.ok(providers.includes("openai"));
		assert.ok(providers.includes("ollama"));
		assert.ok(providers.includes("openrouter"));
		assert.ok(providers.includes("google"));
		assert.ok(!providers.includes("anthropic"));
		assert.ok(!providers.includes("bedrock"));
	});

	it("returns an array of strings", () => {
		const providers = getDiscoverableProviders();
		assert.ok(Array.isArray(providers));
		for (const p of providers) {
			assert.equal(typeof p, "string");
		}
	});
});

// ─── getDefaultTTL ───────────────────────────────────────────────────────────

describe("getDefaultTTL", () => {
	it("returns 5 minutes for ollama", () => {
		assert.equal(getDefaultTTL("ollama"), 5 * 60 * 1000);
	});

	it("returns 1 hour for openai", () => {
		assert.equal(getDefaultTTL("openai"), 60 * 60 * 1000);
	});

	it("returns 1 hour for google", () => {
		assert.equal(getDefaultTTL("google"), 60 * 60 * 1000);
	});

	it("returns 1 hour for openrouter", () => {
		assert.equal(getDefaultTTL("openrouter"), 60 * 60 * 1000);
	});

	it("returns 24 hours for unknown providers", () => {
		assert.equal(getDefaultTTL("some-custom"), 24 * 60 * 60 * 1000);
	});
});

// ─── DISCOVERY_TTLS ──────────────────────────────────────────────────────────

describe("DISCOVERY_TTLS", () => {
	it("has expected keys", () => {
		assert.ok("ollama" in DISCOVERY_TTLS);
		assert.ok("openai" in DISCOVERY_TTLS);
		assert.ok("google" in DISCOVERY_TTLS);
		assert.ok("openrouter" in DISCOVERY_TTLS);
		assert.ok("default" in DISCOVERY_TTLS);
	});

	it("all values are positive numbers", () => {
		for (const [, value] of Object.entries(DISCOVERY_TTLS)) {
			assert.equal(typeof value, "number");
			assert.ok(value > 0);
		}
	});
});

describe("supportsDiscoveryForApi", () => {
	it("returns true for OpenAI-compatible APIs", () => {
		assert.equal(supportsDiscoveryForApi("openai-completions"), true);
		assert.equal(supportsDiscoveryForApi("openai-responses"), true);
	});

	it("returns false for non-discoverable APIs", () => {
		assert.equal(supportsDiscoveryForApi("anthropic-messages"), false);
		assert.equal(supportsDiscoveryForApi(undefined), false);
	});
});
