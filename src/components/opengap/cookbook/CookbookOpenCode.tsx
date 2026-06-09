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
- Prefer official documentation over blog posts
- Never invent version numbers or API signatures
- Must flag breaking changes clearly`;

const opencodeJson = `{
  "model": "anthropic/claude-sonnet-4-6",
  "autoshare": false
}`;

const importCmd = `opengap import --from opencode ./your-project -d ./my-agent`;
const validateCmd = `opengap validate -d ./my-agent`;
const infoCmd = `opengap info -d ./my-agent`;

const agentYaml = `spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from OpenCode project: your-project
model:
  preferred: claude-sonnet-4-6    # "anthropic/" prefix stripped automatically`;

const soulMd = `# Soul

## Research Assistant
You are a research assistant that helps developers find accurate technical
information. Search before answering...

## Style
Use plain language. Format code with syntax highlighting...`;

const rulesMd = `# Rules

## Rules
- Always search before answering questions about libraries or APIs
- Prefer official documentation over blog posts
- Never invent version numbers or API signatures
- Must flag breaking changes clearly`;

const steps = [
  { step: "1", desc: "Importer looks for AGENTS.md in the source directory — fails if not found" },
  { step: "2", desc: "opencode.json is read if present — model field extracted, provider prefix (anthropic/, openai/, etc.) stripped" },
  { step: "3", desc: "AGENTS.md is split by heading — sections whose title contains rule/always/never/must/constraint go to RULES.md, everything else goes to SOUL.md" },
  { step: "4", desc: "agent.yaml is written with cleaned model ID and directory name as agent name" },
  { step: "5", desc: "RULES.md is only created if at least one matching section is found" },
  { step: "6", desc: "opengap info confirms model was read correctly — verify the stripped model ID is valid for your runtime" },
];

export function CookbookOpenCode() {
  return (
    <section id="cookbook-opencode" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">OpenCode → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            OpenCode uses <code className="text-primary text-xs">AGENTS.md</code> for instructions and an optional
            <code className="text-primary text-xs"> opencode.json</code> for model config.
            The model string uses a <code className="text-primary text-xs">provider/model-id</code> format —
            the importer strips the provider prefix so only the model ID lands in <code className="text-primary text-xs">agent.yaml</code>.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Your OpenCode project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            <code className="text-primary text-xs">AGENTS.md</code> is required. <code className="text-primary text-xs">opencode.json</code> is optional but needed to carry the model over.
          </p>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">AGENTS.md</code>:</p>
              <CodeBlock code={agentsMd} filename="AGENTS.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">opencode.json</code>:</p>
              <CodeBlock code={opencodeJson} filename="opencode.json" />
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
              <p>The provider prefix is stripped from the model string. Verify the resulting model ID in <code className="text-primary text-xs">agent.yaml</code> is valid for your intended runtime.</p>
              <p>SOUL vs RULES routing is keyword-based on headings. A section titled "Guidelines" lands in SOUL.md even if it contains rules — rename it to include "rules" or "constraints" for correct routing.</p>
              <p>Only <code className="text-primary text-xs">model</code> is read from <code className="text-primary text-xs">opencode.json</code> — all other fields are ignored.</p>
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
