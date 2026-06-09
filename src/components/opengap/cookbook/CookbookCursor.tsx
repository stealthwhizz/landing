import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const globalMdc = `---
alwaysApply: true
description: Global research assistant behavior
---

You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources. Be precise about
version numbers and API compatibility.

Use plain language. Format code with syntax highlighting. When uncertain,
say so explicitly rather than guessing.`;

const scopedMdc = `---
alwaysApply: false
description: Rules for reviewing API integration code
globs: ["src/api/**", "src/integrations/**"]
---

When reviewing API integration code:
- Check authentication is handled securely
- Verify error responses are handled explicitly
- Flag any hardcoded credentials or tokens
- Confirm rate limiting is accounted for`;

const importCmd = `opengap import --from cursor ./your-project -d ./my-agent`;

const validateCmd = `opengap validate -d ./my-agent`;
const infoCmd = `opengap info -d ./my-agent`;

const agentYaml = `spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Cursor project: your-project
skills:
  - api-review`;

const soulMd = `# Soul — imported from Cursor rules

You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources...`;

const skillMd = `---
name: api-review
description: Rules for reviewing API integration code
metadata:
  globs: src/api/** src/integrations/**
---

When reviewing API integration code:
- Check authentication is handled securely
- Verify error responses are handled explicitly
- Flag any hardcoded credentials or tokens
- Confirm rate limiting is accounted for`;

const steps = [
  { step: "1", desc: "Importer walks .cursor/rules/ and reads all .mdc files" },
  { step: "2", desc: "Rules with alwaysApply: true are merged into a single SOUL.md in filesystem order" },
  { step: "3", desc: "Rules with alwaysApply: false each become their own skill — name taken from filename without .mdc" },
  { step: "4", desc: "Glob patterns from scoped rule frontmatter are preserved in SKILL.md metadata (informational only)" },
  { step: "5", desc: "agent.yaml is written with the skills list populated" },
  { step: "6", desc: "If no .cursor/rules/ exists, falls back to .cursorrules or AGENTS.md → SOUL.md only" },
];

export function CookbookCursor() {
  return (
    <section id="cookbook-cursor" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Cursor → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Cursor stores rules in <code className="text-primary text-xs">.cursor/rules/*.mdc</code> files with YAML frontmatter.
            Rules with <code className="text-primary text-xs">alwaysApply: true</code> become <code className="text-primary text-xs">SOUL.md</code>.
            Rules with <code className="text-primary text-xs">alwaysApply: false</code> each become a skill.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Your Cursor project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Two <code className="text-primary text-xs">.mdc</code> files — one global, one scoped:
          </p>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.cursor/rules/global.mdc</code> — global rule:</p>
              <CodeBlock code={globalMdc} filename=".cursor/rules/global.mdc" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.cursor/rules/api-review.mdc</code> — scoped rule:</p>
              <CodeBlock code={scopedMdc} filename=".cursor/rules/api-review.mdc" />
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
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">SOUL.md</code> (from alwaysApply rule):</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">skills/api-review/SKILL.md</code> (from scoped rule):</p>
              <CodeBlock code={skillMd} filename="SKILL.md" />
            </div>
          </div>
          <div className="rounded-md border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 mt-6">
            <p className="text-[10px] uppercase tracking-widest text-yellow-500/70 font-body mb-1">Known Limitations</p>
            <div className="text-[11px] text-muted-foreground font-body leading-relaxed space-y-1.5">
              <p>Glob patterns are stored in <code className="text-primary text-xs">SKILL.md</code> metadata but not enforced at runtime — OpenGAP skills are invoked by the agent, not triggered by file path.</p>
              <p>Legacy <code className="text-primary text-xs">.cursorrules</code> files produce only a SOUL.md with no skills.</p>
              <p>Multiple <code className="text-primary text-xs">alwaysApply: true</code> rules are merged into one SOUL.md with no separator between them.</p>
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
