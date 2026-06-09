# OpenGAP Migration Cookbook

How to move an existing agent into OpenGAP. Each section covers one framework that has a native import command — what files it reads, how it maps to OpenGAP, and exactly what to run.

All commands verified against `opengap v0.4.0`.

**Who this is for:** a developer who already has a working agent in one of these frameworks and wants to version, share, or run it via OpenGAP — without rewriting it from scratch.

---

## Frameworks covered

- [Claude Code](#claude-code)
- [Cursor](#cursor)
- [CrewAI](#crewai)
- [OpenCode](#opencode)
- [Gemini CLI](#gemini-cli)
- [Codex CLI](#codex-cli)

---

## Claude Code

Claude Code stores its agent in `CLAUDE.md` at the project root. The importer splits it into `SOUL.md` and `RULES.md` by scanning section headings, and copies any skills from `.claude/skills/`.

### Before migration

```
your-project/
├── CLAUDE.md          ← system prompt + behavior rules
└── .claude/
    ├── settings.json  ← model, permissions (model is NOT read)
    └── skills/
        └── my-skill/
```

### What maps to OpenGAP

| Framework | OpenGAP |
|---|---|
| `CLAUDE.md` — identity/style/about sections | `SOUL.md` |
| `CLAUDE.md` — always/never/must/rule sections | `RULES.md` |
| `.claude/skills/<name>/` | `skills/<name>/SKILL.md` |
| Directory name | `agent.yaml` → `name` |

### What stays in Claude Code

`.claude/settings.json` permissions and hooks are not imported — they are Claude Code runtime config with no OpenGAP equivalent. The model field in `settings.json` is also ignored.

### Migration steps

```bash
opengap import --from claude ./your-project -d ./my-agent
opengap validate -d ./my-agent
opengap info -d ./my-agent
```

### Result

```
my-agent/
├── agent.yaml
├── SOUL.md
├── RULES.md
└── skills/
    └── my-skill/
        └── SKILL.md
```

```yaml
# agent.yaml
spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Claude Code project: your-project
model:
  preferred: claude-sonnet-4-5-20250929  # hardcoded — settings.json model is NOT read
skills:
  - my-skill
tools: []
```

### Known Limitations

- The model in `.claude/settings.json` is not read. The importer always writes `claude-sonnet-4-5-20250929` — edit `agent.yaml` manually after import if you need a different model.
- Section routing is keyword-based on headings. Sections that don't match either keyword set default to `SOUL.md` — review both files after import.

---

## Cursor

Cursor stores rules in `.cursor/rules/*.mdc` files with YAML frontmatter. Rules with `alwaysApply: true` become `SOUL.md`. Rules with `alwaysApply: false` each become a skill.

### Before migration

```
your-project/
└── .cursor/
    └── rules/
        ├── global.mdc       ← alwaysApply: true  → SOUL.md
        └── api-review.mdc   ← alwaysApply: false → skills/api-review/

# Legacy formats also supported:
# .cursorrules  → SOUL.md
# AGENTS.md     → SOUL.md
```

**Example `.cursor/rules/global.mdc`:**
```markdown
---
alwaysApply: true
description: Global research assistant behavior
---

You are a research assistant...
```

**Example `.cursor/rules/api-review.mdc`:**
```markdown
---
alwaysApply: false
description: Rules for reviewing API integration code
globs: ["src/api/**", "src/integrations/**"]
---

When reviewing API integration code:
- Check authentication is handled securely
...
```

### What maps to OpenGAP

| Framework | OpenGAP |
|---|---|
| `.cursor/rules/*.mdc` (`alwaysApply: true`) | `SOUL.md` |
| `.cursor/rules/*.mdc` (`alwaysApply: false`) | `skills/<name>/SKILL.md` |
| `.mdc` frontmatter → `globs` | `SKILL.md` frontmatter → `metadata.globs` |
| `.mdc` frontmatter → `description` | `SKILL.md` frontmatter → `description` |
| `.cursorrules` or `AGENTS.md` (legacy) | `SOUL.md` |
| Directory name | `agent.yaml` → `name` |

### What stays in Cursor

`.cursor/settings.json` (model, keybindings, UI preferences) is not read. Glob patterns from scoped rules are preserved in `SKILL.md` frontmatter as metadata but have no runtime effect in OpenGAP.

### Migration steps

```bash
opengap import --from cursor ./your-project -d ./my-agent
opengap validate -d ./my-agent
opengap info -d ./my-agent
```

### Result

```
my-agent/
├── agent.yaml
├── SOUL.md
└── skills/
    └── api-review/
        └── SKILL.md
```

```yaml
# agent.yaml
spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Cursor project: your-project
skills:
  - api-review
```

```markdown
<!-- skills/api-review/SKILL.md -->
---
name: api-review
description: Rules for reviewing API integration code
metadata:
  globs: src/api/** src/integrations/**
---

When reviewing API integration code:
- Check authentication is handled securely
...
```

### Known Limitations

- Glob patterns are stored in `SKILL.md` metadata but not enforced at runtime — OpenGAP skills are invoked by the agent, not triggered by file path.
- Legacy `.cursorrules` files produce only a `SOUL.md` with no skills.
- Multiple `alwaysApply: true` rules are merged into one `SOUL.md` with no separator between them.

---

## CrewAI

The importer reads **only the YAML config file** — Python definitions are not parsed. Pass the path to `crew.yaml` directly. The first agent becomes the root; additional agents become sub-agents.

### Before migration

```yaml
# crew.yaml
agents:
  researcher:
    role: Research Analyst
    goal: Find accurate, up-to-date information on any topic
    backstory: >
      You are an expert research analyst...
    tools:
      - web_search

  writer:
    role: Technical Writer
    goal: Transform research findings into clear documentation
    backstory: >
      You are a technical writer...

tasks:
  research_task:
    description: "Research: {topic}"
    agent: researcher
  writing_task:
    description: "Write a summary based on findings"
    agent: writer
```

### What maps to OpenGAP

| Framework | OpenGAP |
|---|---|
| `agents[0].role` | `SOUL.md` → `## Core Identity` |
| `agents[0].backstory` | `SOUL.md` → `## Background` |
| `agents[0].goal` | `SOUL.md` → `## Purpose` + `agent.yaml` → `description` |
| `agents[0]` name | `agent.yaml` → `name` |
| `agents[1..n]` (additional agents) | `agents/<name>/` sub-agent directories |

### What stays in CrewAI

Tasks, process type (sequential / hierarchical), and tool definitions are not imported. Keep `crew.yaml` for running the crew; use OpenGAP for versioning and sharing the agent identities.

### Migration steps

```bash
# Pass the yaml FILE path — not the directory
opengap import --from crewai ./crew.yaml -d ./my-agent
opengap validate -d ./my-agent
opengap info -d ./my-agent
```

### Result

```
my-agent/
├── agent.yaml
├── SOUL.md
└── agents/
    └── writer/
        ├── agent.yaml
        └── SOUL.md
```

```yaml
# agent.yaml (root — from first agent)
spec_version: 0.1.0
name: researcher
version: 0.1.0
description: Find accurate, up-to-date information on any topic
```

```markdown
<!-- SOUL.md -->
# Soul

## Core Identity
Research Analyst

## Background
You are an expert research analyst...

## Purpose
Find accurate, up-to-date information on any topic
```

### Known Limitations

- **Python files are not read.** If your crew is only defined in `crew.py`, the import will fail — you need a `crew.yaml` with an `agents:` key.
- Tasks (`description`, `expected_output`, `context`) are silently dropped.
- Tool names in the YAML are not imported — add them manually to `agent.yaml` under `tools:` after import.

---

## OpenCode

OpenCode uses `AGENTS.md` for instructions and an optional `opencode.json` for model config. The model string uses a `provider/model-id` format — the importer strips the provider prefix automatically.

### Before migration

```
your-project/
├── AGENTS.md        ← system prompt (required)
└── opencode.json    ← model config (optional)
```

```json
// opencode.json
{
  "model": "anthropic/claude-sonnet-4-6",
  "autoshare": false
}
```

```markdown
<!-- AGENTS.md -->
# Research Assistant

You are a research assistant...

## Style
Use plain language...

## Rules
- Always search before answering
- Never invent version numbers
- Must flag breaking changes
```

### What maps to OpenGAP

| Framework | OpenGAP |
|---|---|
| `AGENTS.md` — non-rules sections | `SOUL.md` |
| `AGENTS.md` — rule/always/never/must headings | `RULES.md` |
| `opencode.json` → `model` (`provider/model-id`) | `agent.yaml` → `model.preferred` (model-id only) |
| Directory name | `agent.yaml` → `name` |

### What stays in OpenCode

`opencode.json` fields other than `model` — such as `autoshare`, keybindings, UI settings — are not imported.

### Migration steps

```bash
opengap import --from opencode ./your-project -d ./my-agent
opengap validate -d ./my-agent
opengap info -d ./my-agent
```

### Result

```
my-agent/
├── agent.yaml
├── SOUL.md
└── RULES.md
```

```yaml
# agent.yaml
spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from OpenCode project: your-project
model:
  preferred: claude-sonnet-4-6    # "anthropic/" prefix stripped automatically
```

### Known Limitations

- The provider prefix is stripped from the model string — verify the resulting model ID is valid for your runtime.
- SOUL vs RULES routing is keyword-based on headings. A section titled "Guidelines" lands in `SOUL.md` — rename it to include "rules" or "constraints" for correct routing.
- Only `model` is read from `opencode.json` — all other fields are ignored.

---

## Gemini CLI

Gemini CLI uses `GEMINI.md` for instructions and `.gemini/settings.json` for config. This is the only framework where the supervision level transfers automatically — `approvalMode` maps directly to `compliance.supervision.human_in_the_loop`.

### Before migration

```
your-project/
├── GEMINI.md              ← system prompt (required)
└── .gemini/
    └── settings.json      ← model + approvalMode (optional)
```

```json
// .gemini/settings.json
{
  "model": "gemini-2.5-pro",
  "approvalMode": "plan",
  "sandbox": false
}
```

**`approvalMode` mapping:**

| approvalMode | human_in_the_loop |
|---|---|
| `"plan"` | `always` |
| `"default"` | `conditional` |
| `"yolo"` | `none` |
| `"auto_edit"` | `advisory` |

### What maps to OpenGAP

| Framework | OpenGAP |
|---|---|
| `GEMINI.md` — non-rules sections | `SOUL.md` |
| `GEMINI.md` — rule/always/never/must headings | `RULES.md` |
| `.gemini/settings.json` → `model` | `agent.yaml` → `model.preferred` |
| `.gemini/settings.json` → `approvalMode` | `agent.yaml` → `compliance.supervision.human_in_the_loop` |
| Directory name | `agent.yaml` → `name` |

### What stays in Gemini CLI

`sandbox`, `checkpointing`, and other `settings.json` fields are not imported. Gemini CLI extensions and tool configs are not read.

### Migration steps

```bash
opengap import --from gemini ./your-project -d ./my-agent
opengap validate -d ./my-agent
opengap info -d ./my-agent
```

### Result

```
my-agent/
├── agent.yaml
├── SOUL.md
└── RULES.md
```

```yaml
# agent.yaml
spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Gemini CLI project: your-project
model:
  preferred: gemini-2.5-pro
compliance:
  supervision:
    human_in_the_loop: always    # mapped from approvalMode: "plan"
```

### Known Limitations

- Only the four documented `approvalMode` values are mapped. Any other value is silently ignored and no compliance block is written.
- If `.gemini/settings.json` is absent, neither model nor compliance fields are written to `agent.yaml`.
- `sandbox`, `checkpointing`, and other settings fields are ignored.

---

## Codex CLI

Codex CLI uses the same `AGENTS.md` convention as OpenCode but pairs it with `codex.json`. Key difference: the model string has no provider prefix — it is written to `agent.yaml` as-is. The `provider` field is ignored.

### Before migration

```
your-project/
├── AGENTS.md      ← system prompt (required)
└── codex.json     ← model config (optional)
```

```json
// codex.json — note: no provider prefix on model, "provider" field is ignored
{
  "model": "o4-mini",
  "provider": "openai"
}
```

### What maps to OpenGAP

| Framework | OpenGAP |
|---|---|
| `AGENTS.md` — non-rules sections | `SOUL.md` |
| `AGENTS.md` — rule/always/never/must headings | `RULES.md` |
| `codex.json` → `model` | `agent.yaml` → `model.preferred` (no transformation) |
| `codex.json` → `provider` | — (ignored) |
| Directory name | `agent.yaml` → `name` |

### What stays in Codex CLI

The `provider` field in `codex.json` is silently ignored. Codex sandbox and approval mode settings are not imported.

### Migration steps

```bash
opengap import --from codex ./your-project -d ./my-agent
opengap validate -d ./my-agent
opengap info -d ./my-agent
```

### Result

```
my-agent/
├── agent.yaml
├── SOUL.md
└── RULES.md
```

```yaml
# agent.yaml
spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Codex CLI project: your-project
model:
  preferred: o4-mini    # used as-is — no provider prefix to strip
```

### Known Limitations

- The `provider` field in `codex.json` is silently ignored — configure provider routing at the runtime level, not in `agent.yaml`.
- SOUL vs RULES routing is keyword-based on headings. A section titled "Guidelines" lands in `SOUL.md` — rename it to include "rules" or "constraints" for correct routing.
- Only `model` is read from `codex.json` — all other fields are ignored.
