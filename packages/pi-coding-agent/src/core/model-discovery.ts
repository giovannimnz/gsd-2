/**
 * Provider discovery adapters for runtime model enumeration.
 * Each adapter implements ProviderDiscoveryAdapter to fetch models from provider APIs.
 */

export interface DiscoveredModel {
	id: string;
	name?: string;
	contextWindow?: number;
	maxTokens?: number;
	reasoning?: boolean;
	input?: ("text" | "image")[];
	cost?: { input: number; output: number; cacheRead: number; cacheWrite: number };
}

export interface DiscoveryResult {
	provider: string;
	models: DiscoveredModel[];
	fetchedAt: number;
	error?: string;
}

export interface ProviderDiscoveryAdapter {
	provider: string;
	supportsDiscovery: boolean;
	fetchModels(apiKey: string, baseUrl?: string): Promise<DiscoveredModel[]>;
}

/** Per-provider TTLs in milliseconds */
export const DISCOVERY_TTLS: Record<string, number> = {
	ollama: 5 * 60 * 1000, // 5 minutes (local, models change often)
	openai: 60 * 60 * 1000, // 1 hour
	google: 60 * 60 * 1000, // 1 hour
	openrouter: 60 * 60 * 1000, // 1 hour
	default: 24 * 60 * 60 * 1000, // 24 hours
};

export function getDefaultTTL(provider: string): number {
	return DISCOVERY_TTLS[provider] ?? DISCOVERY_TTLS.default;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { ...options, signal: controller.signal });
	} finally {
		clearTimeout(timeout);
	}
}

// ─── OpenAI Adapter ──────────────────────────────────────────────────────────

const OPENAI_EXCLUDED_PREFIXES = ["embedding", "tts", "dall-e", "whisper", "text-embedding", "davinci", "babbage"];

class OpenAIDiscoveryAdapter implements ProviderDiscoveryAdapter {
	provider = "openai";
	supportsDiscovery = true;

	async fetchModels(apiKey: string, baseUrl?: string): Promise<DiscoveredModel[]> {
		const url = `${baseUrl ?? "https://api.openai.com"}/v1/models`;
		const response = await fetchWithTimeout(url, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});

		if (!response.ok) {
			throw new Error(`OpenAI models API returned ${response.status}: ${response.statusText}`);
		}

		const data = (await response.json()) as {
			data: Array<{
				id: string;
				owned_by?: string;
				name?: string;
				context_length?: number;
				max_output_tokens?: number;
				top_provider?: { max_completion_tokens?: number };
				pricing?: { prompt?: string; completion?: string; prompt_cache_hit?: string };
				object?: string;
			}>;
		};

		return data.data
			.filter((m) => !OPENAI_EXCLUDED_PREFIXES.some((prefix) => m.id.startsWith(prefix)))
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
					maxTokens: m.top_provider?.max_completion_tokens ?? m.max_output_tokens,
					cost,
					input: ["text" as const, "image" as const],
				};
			});
	}
}

// ─── Ollama Adapter ──────────────────────────────────────────────────────────

class OllamaDiscoveryAdapter implements ProviderDiscoveryAdapter {
	provider = "ollama";
	supportsDiscovery = true;

	async fetchModels(_apiKey: string, baseUrl?: string): Promise<DiscoveredModel[]> {
		const url = `${baseUrl ?? "http://localhost:11434"}/api/tags`;
		const response = await fetchWithTimeout(url);

		if (!response.ok) {
			throw new Error(`Ollama tags API returned ${response.status}: ${response.statusText}`);
		}

		const data = (await response.json()) as {
			models: Array<{ name: string; size: number; details?: { parameter_size?: string } }>;
		};

		return (data.models ?? []).map((m) => ({
			id: m.name,
			name: m.name,
			input: ["text" as const],
		}));
	}
}

// ─── OpenRouter Adapter ──────────────────────────────────────────────────────

class OpenRouterDiscoveryAdapter implements ProviderDiscoveryAdapter {
	provider = "openrouter";
	supportsDiscovery = true;

	async fetchModels(apiKey: string, baseUrl?: string): Promise<DiscoveredModel[]> {
		const url = `${baseUrl ?? "https://openrouter.ai"}/api/v1/models`;
		const response = await fetchWithTimeout(url, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});

		if (!response.ok) {
			throw new Error(`OpenRouter models API returned ${response.status}: ${response.statusText}`);
		}

		const data = (await response.json()) as {
			data: Array<{
				id: string;
				name: string;
				context_length?: number;
				top_provider?: { max_completion_tokens?: number };
				pricing?: { prompt: string; completion: string };
			}>;
		};

		return (data.data ?? []).map((m) => {
			const cost =
				m.pricing?.prompt !== undefined && m.pricing?.completion !== undefined
					? {
							input: parseFloat(m.pricing.prompt) * 1_000_000,
							output: parseFloat(m.pricing.completion) * 1_000_000,
							cacheRead: 0,
							cacheWrite: 0,
						}
					: undefined;

			return {
				id: m.id,
				name: m.name,
				contextWindow: m.context_length,
				maxTokens: m.top_provider?.max_completion_tokens,
				cost,
				input: ["text" as const, "image" as const],
			};
		});
	}
}

// ─── Google/Gemini Adapter ───────────────────────────────────────────────────

class GoogleDiscoveryAdapter implements ProviderDiscoveryAdapter {
	provider = "google";
	supportsDiscovery = true;

	async fetchModels(apiKey: string, baseUrl?: string): Promise<DiscoveredModel[]> {
		const url = `${baseUrl ?? "https://generativelanguage.googleapis.com"}/v1beta/models?key=${apiKey}`;
		const response = await fetchWithTimeout(url);

		if (!response.ok) {
			throw new Error(`Google models API returned ${response.status}: ${response.statusText}`);
		}

		const data = (await response.json()) as {
			models: Array<{
				name: string;
				displayName: string;
				supportedGenerationMethods?: string[];
				inputTokenLimit?: number;
				outputTokenLimit?: number;
			}>;
		};

		return (data.models ?? [])
			.filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
			.map((m) => ({
				id: m.name.replace("models/", ""),
				name: m.displayName,
				contextWindow: m.inputTokenLimit,
				maxTokens: m.outputTokenLimit,
				input: ["text" as const, "image" as const],
			}));
	}
}

// ─── Static Adapter (no discovery) ───────────────────────────────────────────

class StaticDiscoveryAdapter implements ProviderDiscoveryAdapter {
	provider: string;
	supportsDiscovery = false;

	constructor(provider: string) {
		this.provider = provider;
	}

	async fetchModels(): Promise<DiscoveredModel[]> {
		return [];
	}
}

// ─── Registry ────────────────────────────────────────────────────────────────

/**
 * Provider aliases that should use the OpenAI discovery adapter.
 * Custom OpenAI-compatible proxies can register here to get automatic
 * model discovery from their /v1/models endpoint.
 */
const OPENAI_COMPATIBLE_ALIASES = ["atius-router"];

function createOpenAIAlias(name: string): ProviderDiscoveryAdapter {
	const adapter = new OpenAIDiscoveryAdapter();
	adapter.provider = name;
	return adapter;
}

const adapters: Record<string, ProviderDiscoveryAdapter> = {
	openai: new OpenAIDiscoveryAdapter(),
	ollama: new OllamaDiscoveryAdapter(),
	openrouter: new OpenRouterDiscoveryAdapter(),
	google: new GoogleDiscoveryAdapter(),
	anthropic: new StaticDiscoveryAdapter("anthropic"),
	bedrock: new StaticDiscoveryAdapter("bedrock"),
	"azure-openai": new StaticDiscoveryAdapter("azure-openai"),
	groq: new StaticDiscoveryAdapter("groq"),
	cerebras: new StaticDiscoveryAdapter("cerebras"),
	xai: new StaticDiscoveryAdapter("xai"),
	mistral: new StaticDiscoveryAdapter("mistral"),
	// Custom OpenAI-compatible proxies get discovery from their /v1/models endpoint
	...Object.fromEntries(OPENAI_COMPATIBLE_ALIASES.map((alias) => [alias, createOpenAIAlias(alias)])),
};

export function getDiscoveryAdapter(provider: string): ProviderDiscoveryAdapter {
	return adapters[provider] ?? new StaticDiscoveryAdapter(provider);
}

export function getDiscoverableProviders(): string[] {
	return Object.entries(adapters)
		.filter(([, adapter]) => adapter.supportsDiscovery)
		.map(([name]) => name);
}
