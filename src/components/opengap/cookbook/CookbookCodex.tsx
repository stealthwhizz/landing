import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const agentsMd = `# Research Assistant

You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources. Be precise about
version numbers and API compatibility.

## Style

Use plain language. Format code with syntax highlighting. When uncertain,
say so explicitly rather than guessing.

## Rules

- Always search before answering questions about libraries or APIs
- Never invent version numbers or API signatures
- Must flag breaking changes clearly`;

const codexJson = `{
  "model": "o4-mini",
  "provider": "openai"
}`;

const importCmd = `opengap import --from codex ./your-project -d ./my-agent`;
const validateCmd = `opengap validate -d ./my-agent`;
const infoCmd = `opengap info -d ./my-agent`;

const agentYaml = `spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Codex CLI project: your-project
model:
  preferred: o4-mini    # used as-is — no provider prefix to strip`;

const soulMd = `# Soul

## Research Assistant
You are a research assistant that helps developers find accurate technical
information. Search before answering...

## Style
Use plain language. Format code with syntax highlighting...`;

const rulesMd = `# Rules

## Rules
- Always search before answering questions about libraries or APIs
- Never invent version numbers or API signatures
- Must flag breaking changes clearly`;

const steps = [
  { step: "1", desc: "Importer looks for AGENTS.md in the source directory — fails if not found" },
  { step: "2", desc: "codex.json is read if present — only the model field is used, provider field is ignored" },
  { step: "3", desc: "Unlike opencode.json, the model string has no provider prefix — it is written to agent.yaml as-is" },
  { step: "4", desc: "AGENTS.md is split by heading — rule/always/never/must sections go to RULES.md, everything else to SOUL.md" },
  { step: "5", desc: "RULES.md is only created if at least one matching section heading is found" },
  { step: "6", desc: "opengap info confirms model was read correctly from codex.json" },
];

export function CookbookCodex() {
  return (
    <section id="cookbook-codex" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Codex CLI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Codex CLI uses the same <code className="text-primary text-xs">AGENTS.md</code> convention as OpenCode
            but pairs it with <code className="text-primary text-xs">codex.json</code>.
            Key difference: the model string has no provider prefix — it is written to <code className="text-primary text-xs">agent.yaml</code> as-is.
            The <code className="text-primary text-xs">provider</code> field is ignored.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Your Codex CLI project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            <code className="text-primary text-xs">AGENTS.md</code> is required. <code className="text-primary text-xs">codex.json</code> is optional but needed to carry the model over.
          </p>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">AGENTS.md</code>:</p>
              <CodeBlock code={agentsMd} filename="AGENTS.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">codex.json</code> — note: <code className="text-primary text-xs">provider</code> is ignored during import:</p>
              <CodeBlock code={codexJson} filename="codex.json" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Run the import</h3>
          <CodeBlock code={importCmd} filename="terminal" />
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Validate and inspect</h3>
          <div className="space-y-3 mt-4">
            <CodeBlock code={validateCmd} filename="terminal" />
            <CodeBlock code={infoCmd} filename="terminal" />
          </div>
        </motion.div>

        {/* Part 4 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — Result</h3>
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
          </div>
          <div className="rounded-md border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 mt-6">
            <p className="text-[10px] uppercase tracking-widest text-yellow-500/70 font-body mb-1">Known Limitations</p>
            <div className="text-[11px] text-muted-foreground font-body leading-relaxed space-y-1.5">
              <p>The <code className="text-primary text-xs">provider</code> field in <code className="text-primary text-xs">codex.json</code> is silently ignored — configure provider routing at the runtime level, not in <code className="text-primary text-xs">agent.yaml</code>.</p>
              <p>SOUL vs RULES routing is keyword-based on headings. A section titled "Guidelines" lands in SOUL.md — rename it to include "rules" or "constraints" for correct routing.</p>
              <p>Only <code className="text-primary text-xs">model</code> is read from <code className="text-primary text-xs">codex.json</code> — all other fields are ignored.</p>
            </div>
          </div>
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
