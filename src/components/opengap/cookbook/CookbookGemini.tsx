import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const geminiMd = `# Research Assistant

You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources. Be precise about
version numbers and API compatibility.

## Style

Use plain language. Format code with syntax highlighting. When uncertain,
say so explicitly rather than guessing.

## Always

- Search before answering questions about libraries or APIs
- Prefer official documentation over blog posts
- Flag breaking changes clearly`;

const settingsJson = `{
  "model": "gemini-2.5-pro",
  "approvalMode": "plan",
  "sandbox": false
}`;

const approvalTable = `approvalMode: "plan"       → human_in_the_loop: always
approvalMode: "default"    → human_in_the_loop: conditional
approvalMode: "yolo"       → human_in_the_loop: none
approvalMode: "auto_edit"  → human_in_the_loop: advisory`;

const importCmd = `opengap import --from gemini ./your-project -d ./my-agent`;
const validateCmd = `opengap validate -d ./my-agent`;
const infoCmd = `opengap info -d ./my-agent`;

const agentYaml = `spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Gemini CLI project: your-project
model:
  preferred: gemini-2.5-pro
compliance:
  supervision:
    human_in_the_loop: always    # mapped from approvalMode: "plan"`;

const soulMd = `# Soul

## Research Assistant
You are a research assistant that helps developers find accurate technical
information. Search before answering...

## Style
Use plain language. Format code with syntax highlighting...`;

const rulesMd = `# Rules

## Always
- Search before answering questions about libraries or APIs
- Prefer official documentation over blog posts
- Flag breaking changes clearly`;

const steps = [
  { step: "1", desc: "Importer looks for GEMINI.md in the source directory — fails if not found" },
  { step: "2", desc: ".gemini/settings.json is read if present — model and approvalMode extracted" },
  { step: "3", desc: "approvalMode is mapped to compliance.supervision.human_in_the_loop in agent.yaml — the only framework where supervision level transfers automatically" },
  { step: "4", desc: "GEMINI.md is split by heading — rule/always/never/must sections go to RULES.md, everything else to SOUL.md" },
  { step: "5", desc: "opengap info shows model and Compliance: Human-in-the-loop field confirming the mapping worked" },
];

export function CookbookGemini() {
  return (
    <section id="cookbook-gemini" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Gemini CLI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Gemini CLI uses <code className="text-primary text-xs">GEMINI.md</code> for instructions and
            <code className="text-primary text-xs"> .gemini/settings.json</code> for config.
            This is the only framework where the supervision level transfers automatically —
            <code className="text-primary text-xs"> approvalMode</code> maps directly to
            <code className="text-primary text-xs"> compliance.supervision.human_in_the_loop</code>.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Your Gemini CLI project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            <code className="text-primary text-xs">GEMINI.md</code> is required. <code className="text-primary text-xs">.gemini/settings.json</code> carries the model and approval mode.
          </p>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">GEMINI.md</code>:</p>
              <CodeBlock code={geminiMd} filename="GEMINI.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.gemini/settings.json</code>:</p>
              <CodeBlock code={settingsJson} filename=".gemini/settings.json" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">approvalMode</code> mapping:</p>
              <CodeBlock code={approvalTable} filename="reference" />
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
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">agent.yaml</code> — note the compliance block:</p>
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
              <p>Only the four documented <code className="text-primary text-xs">approvalMode</code> values are mapped. Any other value is silently ignored and no compliance block is written.</p>
              <p>If <code className="text-primary text-xs">.gemini/settings.json</code> is absent, neither model nor compliance fields are written to <code className="text-primary text-xs">agent.yaml</code>.</p>
              <p><code className="text-primary text-xs">sandbox</code>, <code className="text-primary text-xs">checkpointing</code>, and other settings fields are ignored.</p>
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
