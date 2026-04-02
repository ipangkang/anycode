# anycode

A universal coding agent for your terminal. Use **any OpenAI-compatible LLM** as your AI pair programmer.

## Install

```bash
pip install anycode
```

**Requires:** Node.js >= 18 ([install](https://nodejs.org))

## Quick Start

```bash
# First run — select your provider and enter API key
anycode

# Non-interactive mode
anycode -p "Explain this codebase"

# Test connection
anycode --test
```

## Supported Providers

| Provider | Models |
|----------|--------|
| **OpenAI** | gpt-4o, gpt-4o-mini, o1, o3 |
| **DeepSeek** | deepseek-chat, deepseek-reasoner |
| **Qwen** | qwen-max, qwen-plus |
| **MiniMax** | MiniMax-Text-01 |
| **GLM (Zhipu)** | glm-4-plus |
| **SiliconFlow** | DeepSeek-V3, Qwen2.5 |
| **Ollama** | llama3, codellama, mistral |
| **Any OpenAI-compatible API** | Any model |

## Configuration

```bash
# Environment variables (CI/CD friendly)
export ANYCODE_API_KEY="sk-..."
export ANYCODE_MODEL="gpt-4o"
anycode -p "fix this bug"

# Or use config file: ~/.anycode/provider.json
anycode provider-info  # show current config
```

## Tools

anycode has full agent capabilities: **Bash**, **Read**, **Write**, **Edit**, **Grep**, **Glob**, and more.

```bash
anycode -p "Read main.py and find bugs"
anycode -p "Create a REST API with FastAPI"
anycode --dangerously-skip-permissions -p "Run tests and fix failures"
```
