import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-claude-code-project/
├── CLAUDE.md              ← system prompt + behavior rules
└── .claude/
    ├── settings.json      ← model, permissions
    └── skills/
        └── api-review/
            └── api-review.md  ← reusable skill`;

const claudeMd = `# Research Assistant

You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources. Be precise about
version numbers and API compatibility.

## Style

- Use plain language, not marketing speak
- Format code with syntax highlighting
- When uncertain, say so explicitly

## Always

- Search before answering questions about libraries or APIs
- Prefer official documentation over blog posts
- Flag breaking changes clearly`;

const settingsJson = `{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allow": ["WebSearch", "WebFetch", "Read"]
  }
}`;

const skillMd = `---
name: api-review
description: Review API integration code for security and correctness
---

When reviewing API integration code:
- Check authentication is handled securely
- Verify error responses are handled explicitly
- Flag any hardcoded credentials or tokens`;

const agentYaml = `spec_version: 0.1.0
name: research-assistant
version: 0.1.0
description: Research assistant that helps developers find accurate technical information
model:
  preferred: claude-sonnet-4-6
tools:
  - WebSearch
  - WebFetch
  - Read`;

const soulMd = `# Soul

## Core Identity
You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources. Be precise about
version numbers and API compatibility.

## Style
- Use plain language, not marketing speak
- Format code with syntax highlighting
- When uncertain, say so explicitly`;

const rulesMd = `# Rules

- Always search before answering questions about libraries or APIs
- Prefer official documentation over blog posts
- Flag breaking changes clearly`;

const opengapSkillMd = `---
name: api-review
description: Review API integration code for security and correctness
---

When reviewing API integration code:
- Check authentication is handled securely
- Verify error responses are handled explicitly
- Flag any hardcoded credentials or tokens`;

const validateCmd = `opengap validate -d ./my-agent
opengap info -d ./my-agent`;

const mapping = [
  ["CLAUDE.md — identity/style sections", "SOUL.md"],
  ["CLAUDE.md — always/never/must sections", "RULES.md"],
  [".claude/settings.json → model", "agent.yaml → model.preferred"],
  [".claude/settings.json → permissions.allow", "agent.yaml → tools"],
  [".claude/skills/<name>/<name>.md", "skills/<name>/SKILL.md"],
  ["Directory / project name", "agent.yaml → name"],
];

const steps = [
  { step: "1", desc: "Read CLAUDE.md and split by section headings — identity, style, about → SOUL.md; always, never, must, rule → RULES.md" },
  { step: "2", desc: "Take the model from .claude/settings.json → write to agent.yaml → model.preferred" },
  { step: "3", desc: "Take the permissions.allow list from settings.json → write to agent.yaml → tools" },
  { step: "4", desc: "For each skill in .claude/skills/, create skills/<name>/SKILL.md with the same content" },
  { step: "5", desc: "Hooks, extra settings fields, and IDE integrations stay in .claude/ — they are Claude Code-specific runtime config" },
  { step: "6", desc: "Run opengap validate to confirm the structure is correct" },
];

export function CookbookClaudeCode() {
  return (
    <section id="cookbook-claude-code" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude Code → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Claude Code stores its agent definition in <code className="text-primary text-xs">CLAUDE.md</code> at the project root,
            with optional skills in <code className="text-primary text-xs">.claude/skills/</code>.
            The mapping to OpenGAP is straightforward — sections split into <code className="text-primary text-xs">SOUL.md</code> and <code className="text-primary text-xs">RULES.md</code>,
            skills copy over directly.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Sample Claude Code project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">A research assistant with one skill:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">CLAUDE.md</code>:</p>
              <CodeBlock code={claudeMd} filename="CLAUDE.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.claude/settings.json</code>:</p>
              <CodeBlock code={settingsJson} filename=".claude/settings.json" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.claude/skills/api-review/api-review.md</code>:</p>
              <CodeBlock code={skillMd} filename=".claude/skills/api-review/api-review.md" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Claude Code</span><span>OpenGAP</span>
            </div>
            {mapping.map(([from, to], i) => (
              <div key={i} className={`grid grid-cols-2 px-3 py-2 gap-4 border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <span className="text-muted-foreground">{from}</span>
                <span className="text-primary">{to}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Create the OpenGAP files</h3>
          <div className="space-y-5 mt-4">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">RULES.md</code>:</p>
              <CodeBlock code={rulesMd} filename="RULES.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">skills/api-review/SKILL.md</code>:</p>
              <CodeBlock code={opengapSkillMd} filename="skills/api-review/SKILL.md" />
            </div>
          </div>
        </motion.div>

        {/* Part 4 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — Validate</h3>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">What happens step by step</h3>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="paper-card p-3 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3 relative z-10">
                  <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-8">{s.step}</code>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
