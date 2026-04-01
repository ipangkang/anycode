import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

export interface ProviderPreset {
  name: string
  baseUrl: string
  defaultModel: string
  maxTokens?: number
  contextWindow?: number  // Total context window size in tokens
}

export interface ProviderConfig {
  provider: string
  baseUrl: string
  apiKey: string
  model: string
  maxTokens?: number
  contextWindow?: number
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', defaultModel: 'gpt-4o', maxTokens: 16384, contextWindow: 128000 },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', defaultModel: 'deepseek-chat', maxTokens: 8192, contextWindow: 64000 },
  { name: 'Qwen (DashScope)', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', defaultModel: 'qwen-max', maxTokens: 8192, contextWindow: 32000 },
  { name: 'MiniMax', baseUrl: 'https://api.minimax.chat/v1', defaultModel: 'MiniMax-Text-01', maxTokens: 16384, contextWindow: 1000000 },
  { name: 'GLM (Zhipu)', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', defaultModel: 'glm-4-plus', maxTokens: 8192, contextWindow: 128000 },
  { name: 'SiliconFlow', baseUrl: 'https://api.siliconflow.cn/v1', defaultModel: 'deepseek-ai/DeepSeek-V3', maxTokens: 8192, contextWindow: 64000 },
  { name: 'Ollama (Local)', baseUrl: 'http://localhost:11434/v1', defaultModel: 'llama3', maxTokens: 4096, contextWindow: 8000 },
  { name: 'Custom', baseUrl: '', defaultModel: '', contextWindow: 32000 },
]

function getConfigDir(): string {
  return process.env.ANYCODE_CONFIG_DIR ?? join(homedir(), '.anycode')
}

function getConfigPath(): string {
  return join(getConfigDir(), 'provider.json')
}

export function loadProviderConfig(): ProviderConfig | null {
  // Environment variables take priority (useful for CI/CD, quick testing)
  if (process.env.ANYCODE_API_KEY) {
    return {
      provider: 'env',
      baseUrl: process.env.ANYCODE_BASE_URL || 'https://api.openai.com/v1',
      apiKey: process.env.ANYCODE_API_KEY,
      model: process.env.ANYCODE_MODEL || 'gpt-4o',
      maxTokens: process.env.ANYCODE_MAX_TOKENS ? parseInt(process.env.ANYCODE_MAX_TOKENS) : undefined,
    }
  }
  // Fall back to config file
  const configPath = getConfigPath()
  if (!existsSync(configPath)) return null
  try {
    return JSON.parse(readFileSync(configPath, 'utf8')) as ProviderConfig
  } catch {
    return null
  }
}

export function saveProviderConfig(config: ProviderConfig): void {
  const dir = getConfigDir()
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), 'utf8')
}

export function hasProviderConfig(): boolean {
  return loadProviderConfig() !== null
}

// Global cache for synchronous access from non-async code
let _cachedConfig: ProviderConfig | null | undefined = undefined

export function getCachedProviderConfig(): ProviderConfig | null {
  if (_cachedConfig === undefined) {
    _cachedConfig = loadProviderConfig()
  }
  return _cachedConfig
}

export function hasCachedProviderConfig(): boolean {
  return getCachedProviderConfig() !== null
}

export function getMaxTokensForProvider(config: ProviderConfig): number {
  if (config.maxTokens) return config.maxTokens
  const preset = PROVIDER_PRESETS.find(p => p.name === config.provider)
  return preset?.maxTokens || 8192
}

export function getContextWindowForProvider(config: ProviderConfig): number {
  if (config.contextWindow) return config.contextWindow
  const preset = PROVIDER_PRESETS.find(p => p.name === config.provider)
  return preset?.contextWindow || 32000
}
