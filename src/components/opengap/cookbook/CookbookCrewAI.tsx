import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const crewYaml = `agents:
  researcher:
    role: Research Analyst
    goal: Find accurate, up-to-date information on any topic and synthesize key findings
    backstory: >
      You are an expert research analyst with years of experience finding and
      synthesizing information from multiple sources. Known for precision,
      especially regarding version numbers and API compatibility.
    tools:
      - web_search

  writer:
    role: Technical Writer
    goal: Transform research findings into clear, developer-friendly documentation
    backstory: >
      You are a technical writer who specialises in turning dense research into
      concise, actionable documentation for developers.

tasks:
  research_task:
    description: "Research the topic: {topic} and collect key findings with sources."
    expected_output: Bullet-pointed findings with source URLs.
    agent: researcher
  writing_task:
    description: "Write a developer summary based on the research findings."
    expected_output: A short, structured technical summary.
    agent: writer`;

const importCmd = `# Pass the yaml FILE path — not the directory
opengap import --from crewai ./crew.yaml -d ./my-agent`;

const validateCmd = `opengap validate -d ./my-agent`;
const infoCmd = `opengap info -d ./my-agent`;

const agentYaml = `spec_version: 0.1.0
name: researcher
version: 0.1.0
description: Find accurate, up-to-date information on any topic and synthesize key findings`;

const soulMd = `# Soul

## Core Identity
Research Analyst

## Background
You are an expert research analyst with years of experience finding and
synthesizing information from multiple sources...

## Purpose
Find accurate, up-to-date information on any topic and synthesize key findings`;

const subAgentYaml = `# agents/writer/agent.yaml
spec_version: 0.1.0
name: writer
version: 0.1.0
description: Transform research findings into clear, developer-friendly documentation`;

const steps = [
  { step: "1", desc: "Importer reads crew.yaml and parses the agents: key" },
  { step: "2", desc: "First agent (agents[0]) becomes the root OpenGAP agent — role → SOUL ## Core Identity, backstory → SOUL ## Background, goal → SOUL ## Purpose and agent.yaml description" },
  { step: "3", desc: "Each additional agent (agents[1..n]) becomes a sub-agent under agents/<name>/ with its own agent.yaml and SOUL.md" },
  { step: "4", desc: "tasks: block is silently dropped — no equivalent in OpenGAP's agent definition layer" },
  { step: "5", desc: "tools: lists are not imported — add them manually to agent.yaml under tools: after import" },
  { step: "6", desc: "opengap info shows root agent name, description, and sub-agents list" },
];

export function CookbookCrewAI() {
  return (
    <section id="cookbook-crewai" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">CrewAI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            The importer reads <strong>only the YAML config file</strong> — Python definitions are not parsed.
            Pass the path to <code className="text-primary text-xs">crew.yaml</code> directly.
            The first agent becomes the root; additional agents become sub-agents.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Your crew.yaml</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            A two-agent crew with tasks. Only the <code className="text-primary text-xs">agents:</code> block is imported.
          </p>
          <CodeBlock code={crewYaml} filename="crew.yaml" />
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Run the import</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Point directly at the <code className="text-primary text-xs">.yaml</code> file, not the containing directory.
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
          <div className="space-y-5 mt-4">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root <code className="text-primary text-xs">agent.yaml</code> (from first agent):</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent <code className="text-primary text-xs">agents/writer/agent.yaml</code>:</p>
              <CodeBlock code={subAgentYaml} filename="agents/writer/agent.yaml" />
            </div>
          </div>
          <div className="rounded-md border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 mt-6">
            <p className="text-[10px] uppercase tracking-widest text-yellow-500/70 font-body mb-1">Known Limitations</p>
            <div className="text-[11px] text-muted-foreground font-body leading-relaxed space-y-1.5">
              <p><strong>Python files are not read.</strong> If your crew is only defined in <code className="text-primary text-xs">crew.py</code>, the import will fail — you need a <code className="text-primary text-xs">crew.yaml</code> with an <code className="text-primary text-xs">agents:</code> key.</p>
              <p>Tasks (<code className="text-primary text-xs">description</code>, <code className="text-primary text-xs">expected_output</code>, <code className="text-primary text-xs">context</code>) are silently dropped.</p>
              <p>Tool names in the YAML are not imported — add them manually to <code className="text-primary text-xs">agent.yaml</code> under <code className="text-primary text-xs">tools:</code>.</p>
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
