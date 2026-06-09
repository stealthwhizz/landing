import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

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

const importCmd = `opengap import --from claude ./your-project -d ./my-agent`;

const validateCmd = `opengap validate -d ./my-agent`;

const infoCmd = `opengap info -d ./my-agent`;

const agentYaml = `spec_version: 0.1.0
name: your-project
version: 0.1.0
description: Imported from Claude Code project: your-project
model:
  preferred: claude-sonnet-4-5-20250929
skills:
  - api-review
tools: []`;

const soulMd = `# Soul

## Research Assistant
You are a research assistant that helps developers find accurate technical
information. Search before answering. Cite sources...

## Style
- Use plain language, not marketing speak
- Format code with syntax highlighting
- When uncertain, say so explicitly`;

const rulesMd = `# Rules

## Always
- Search before answering questions about libraries or APIs
- Prefer official documentation over blog posts
- Flag breaking changes clearly`;

const steps = [
  { step: "1", desc: "Importer reads CLAUDE.md from the source directory" },
  { step: "2", desc: "Sections are split by heading — identity/style/about go to SOUL.md, always/never/must/rule go to RULES.md, everything else defaults to SOUL.md" },
  { step: "3", desc: ".claude/skills/ directories are walked — each skill is copied to skills/<name>/SKILL.md" },
  { step: "4", desc: "agent.yaml is written with name derived from directory name and model hardcoded to claude-sonnet-4-5-20250929" },
  { step: "5", desc: "opengap validate confirms agent.yaml and SOUL.md are present and well-formed" },
  { step: "6", desc: "opengap info prints agent name, model, skills list, and a SOUL.md preview" },
];

export function CookbookClaudeCode() {
  return (
    <section id="cookbook-claude-code" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude Code → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Claude Code stores its agent in <code className="text-primary text-xs">CLAUDE.md</code> at the project root.
            The importer splits it into <code className="text-primary text-xs">SOUL.md</code> and <code className="text-primary text-xs">RULES.md</code> by
            scanning section headings, and copies any skills from <code className="text-primary text-xs">.claude/skills/</code>.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Your Claude Code project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            These are the files the importer reads. The only required file is <code className="text-primary text-xs">CLAUDE.md</code>.
          </p>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">CLAUDE.md</code>:</p>
              <CodeBlock code={claudeMd} filename="CLAUDE.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.claude/settings.json</code> (optional — model is not read):</p>
              <CodeBlock code={settingsJson} filename=".claude/settings.json" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">.claude/skills/api-review/SKILL.md</code> (optional):</p>
              <CodeBlock code={skillMd} filename=".claude/skills/api-review/SKILL.md" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Run the import</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Pass the project directory as the source. The <code className="text-primary text-xs">-d</code> flag sets where OpenGAP files are written.
          </p>
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
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            The output directory after a successful import:
          </p>
          <div className="space-y-5">
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
              <p>The model in <code className="text-primary text-xs">.claude/settings.json</code> is not read. The importer always writes <code className="text-primary text-xs">claude-sonnet-4-5-20250929</code> — edit <code className="text-primary text-xs">agent.yaml</code> manually after import if you need a different model.</p>
              <p>Section routing is keyword-based on headings. Sections that don't match either keyword set default to SOUL.md — review both files after import.</p>
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
