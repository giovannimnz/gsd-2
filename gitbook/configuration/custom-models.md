# Custom Models

Define custom models and providers in `~/.gsd/agent/models.json`. This lets you add models not in the default registry — self-hosted endpoints, fine-tuned models, proxies, or new provider releases.

## File Location

GSD looks for models.json at:
1. `~/.gsd/agent/models.json` (primary)
2. `~/.pi/agent/models.json` (fallback)

The file reloads each time you open `/model` — no restart needed.

## Basic Structure

```json
{
  "providers": {
    "my-provider": {
      "baseUrl": "https://my-endpoint.example.com/v1",
      "apiKey": "MY_PROVIDER_API_KEY",
      "api": "openai-completions",
      "models": [
        {
          "id": "model-id-here",
          "name": "Friendly Model Name",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 128000,
          "maxTokens": 16384,
          "cost": { "input": 0.15, "output": 0.60, "cacheRead": 0.015, "cacheWrite": 0.19 }
        }
      ]
    }
  }
}
```

## API Key Resolution

The `apiKey` field can be:

- **An environment variable name**: `"OPENROUTER_API_KEY"` — GSD resolves it automatically
- **A literal value**: `"sk-abc123..."` — used directly
- **A dummy value**: `"not-needed"` — for local servers that don't require auth

## Compatibility Flags

Local and non-standard servers often need compatibility adjustments:

```json
{
  "compat": {
    "supportsDeveloperRole": false,
    "supportsReasoningEffort": false,
    "supportsUsageInStreaming": false,
    "thinkingFormat": "qwen"
  }
}
```

| Flag | Default | Purpose |
|------|---------|---------|
| `supportsDeveloperRole` | `true` | Set `false` if the server doesn't support the `developer` message role |
| `supportsReasoningEffort` | `true` | Set `false` if the server doesn't support reasoning effort parameters |
| `supportsUsageInStreaming` | `true` | Set `false` if streaming responses don't include token usage |
| `thinkingFormat` | — | Set `"qwen"` for Qwen thinking mode, `"qwen-chat-template"` for chat template variant |

## Custom Headers

For proxies that need extra headers:

```json
{
  "providers": {
    "litellm-proxy": {
      "baseUrl": "https://litellm.example.com/v1",
      "apiKey": "MY_API_KEY",
      "api": "openai-completions",
      "headers": {
        "x-custom-header": "value"
      },
      "models": [...]
    }
  }
}
```

## Model Overrides

Override specific model settings without redefining the entire model:

```json
{
  "providers": {
    "openrouter": {
      "modelOverrides": {
        "anthropic/claude-sonnet-4": {
          "compat": {
            "openRouterRouting": {
              "only": ["amazon-bedrock"]
            }
          }
        }
      }
    }
  }
}
```

## Cost Tracking

For accurate cost tracking with custom models, add the `cost` field (per million tokens):

```json
"cost": {
  "input": 0.15,
  "output": 0.60,
  "cacheRead": 0.015,
  "cacheWrite": 0.19
}
```

Without this, cost shows $0.00 — which is the expected default for custom models.

## Automatic Model Discovery

GSD automatically discovers models from providers that support discovery (OpenAI, OpenRouter, Google, Ollama, and compatible proxies). When a provider is configured with `baseUrl`, GSD calls `/v1/models` to fetch available models with full metadata:

- **Context window** (`context_length`)
- **Max output tokens** (`top_provider.max_completion_tokens`)
- **Pricing** (`pricing.prompt`, `pricing.completion`, `pricing.prompt_cache_hit`)
- **Display name** (`name` — shown in UI instead of model ID)

### OpenAI-Compatible Proxies

Custom OpenAI-compatible proxies (like New API, LiteLLM, or custom routers) that return enriched metadata in their `/v1/models` endpoint are automatically discovered. The enriched format includes:

```json
{
  "data": [
    {
      "id": "deepseek-chat",
      "name": "DeepSeek V3.2",
      "context_length": 131072,
      "top_provider": { "max_completion_tokens": 8192 },
      "pricing": {
        "prompt": "0.00000028",
        "completion": "0.00000042",
        "prompt_cache_hit": "0.000000028"
      }
    }
  ],
  "object": "list"
}
```

Discovered models are merged into the registry automatically — no manual `models` array needed in `models.json`. To add a custom provider with auto-discovery:

```json
{
  "providers": {
    "my-router": {
      "baseUrl": "https://my-proxy.example.com/v1",
      "apiKey": "MY_API_KEY",
      "api": "openai-completions",
      "authHeader": true,
      "models": []
    }
  }
}
```

With `"models": []`, GSD uses automatic discovery from the provider's `/v1/models` endpoint. If you define models in the array, those are used as fallbacks and merged with discovered models.

## Community Extensions

For providers not built into GSD, community extensions add full provider support:

| Extension | Provider | Install |
|-----------|----------|---------|
| `pi-dashscope` | Alibaba DashScope (Qwen3, GLM-5, etc.) | `gsd install npm:pi-dashscope` |
