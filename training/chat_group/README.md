# Root Ledger Group Chat

A lightweight Rust TUI for hosting a three-way group chat between you and two local fused MLX models:

- **Llama-8B-Abliterated-v3** (`RootLedger-8B-Abliterated-Fused`)
- **Gemma3-12B-NPBP-Abliterated-v3** (`RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused`)

## Build

```bash
cd training/chat_group
cargo build --release
```

## Run

Run from inside `training/chat_group/` (defaults resolve relative to this directory):

```bash
cd training/chat_group
./target/release/chat_group
```

Defaults assume:
- Python: `../../.venv-voice/bin/python3`
- Agent script: `../inference_agent.py`
- Models: `../fused_models/RootLedger-8B-Abliterated-Fused` and `../fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused`

Override paths with:

```bash
./target/release/chat_group \
  --python-path ../../.venv-voice/bin/python3 \
  --llama-path ../fused_models/RootLedger-8B-Abliterated-Fused \
  --gemma-path ../fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused
```

## Controls

| Key | Action |
|-----|--------|
| `Ctrl-C` / `/quit` | Exit |
| `Enter` | Send message |
| `Backspace` | Delete character |
| `↑` / `↓` | Scroll history |
| `Esc` | Stop generation |

## Slash Commands

| Command | Description |
|---------|-------------|
| `/auto` | Toggle auto-chat (models reply to each other) |
| `/llama <msg>` | Send message only to Llama |
| `/gemma <msg>` | Send message only to Gemma |
| `/temp <0.0-2.0>` | Set sampling temperature |
| `/tokens <n>` | Set max tokens (1-4096) |
| `/delay <ms>` | Set auto-chat delay (100-30000ms) |
| `/clear` | Clear conversation history |
| `/stop` | Abort current generation |

## Architecture

Rust TUI (`ratatui` + `crossterm`) spawns two Python inference agents (`training/inference_agent.py`) that load the fused MLX models. Communication is line-delimited JSON over stdin/stdout — no HTTP stack, no async runtime.
