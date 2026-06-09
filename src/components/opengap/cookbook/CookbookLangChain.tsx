import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `cris-m/langgraph_examples/call_support_agent/
└── agent/
    ├── graph.py        ← StateGraph: call_agent, speak, transfer, hold, end nodes
    ├── tools.py        ← next_action, upsert_memory tools
    ├── prompt.py       ← SYSTEM_PROMPT (Acme Corp support agent)
    ├── state.py        ← State TypedDict
    └── configuration.py← model, system_prompt, caller config`;

const promptPy = `# agent/prompt.py — system prompt (excerpt)
SYSTEM_PROMPT = """You are an AI customer support representative for Acme Corporation.

Your core responsibilities:
- Greet the customer and collect their name and issue
- Attempt to resolve the issue before escalating
- Route to the appropriate department if escalation is needed
- Always call next_action after each customer response

Department routing:
- Technical Support: +1-800-555-0101
- Billing:           +1-800-555-0102
- Warranty Claims:   +1-800-555-0103

Communication guidelines:
- Use clear, concise, voice-optimized language
- Confirm customer consent before any transfer

Current time: {time}
Customer memories: {memories}"""`;

const toolsPy = `# agent/tools.py (key excerpt)
from langchain_core.tools import InjectedToolCallId
from langgraph.types import Command

def next_action(
    tool_call_id: Annotated[str, InjectedToolCallId],
    action: Literal["continue", "transfer", "hold", "wait", "end"],
    transfer_reason: Optional[str] = None,
    transfer_number: Optional[str] = None,
) -> Command:
    """Update conversation state: continue, transfer, hold, wait, or end the call."""
    updates = {"next_action": action}
    if action == "transfer":
        updates["transfer_reason"] = transfer_reason
        updates["transfer_number"] = transfer_number
    return Command(update={"messages": [ToolMessage(...)], **updates})

async def upsert_memory(
    content: str,
    context: str,
    *,
    memory_id: Optional[uuid.UUID] = None,
    config: Annotated[RunnableConfig, InjectedToolArg],
    store: Annotated[BaseStore, InjectedStore],
) -> str:
    """Create or update a memory entry indexed by caller's phone number."""
    await store.aput(("memories", caller_number), key=str(id),
                     value={"content": content, "context": context})
    return f"Stored memory {id}"

tools = [next_action, upsert_memory]`;

const graphPy = `# agent/graph.py (key excerpt)
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode

llm = load_chat_model(configurable.model).bind_tools(tools)

builder = StateGraph(State, config_schema=Configuration)
builder.add_node("agent", call_agent)   # calls LLM with system_prompt + memory
builder.add_node("speak",  speak)       # generates TwiML speech
builder.add_node("tools",  ToolNode(tools))
builder.add_node("conversation", conversation)  # Twilio Gather (speech input)
builder.add_node("transfer_call", transfer_call)
builder.add_node("hold_call", hold_call)
builder.add_node("end_call", end_call)

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", route_after_agent, {"tools": "tools", "speak": "speak"})
builder.add_conditional_edges("speak", route_after_speak, {
    "conversation": "conversation", "transfer": "transfer_call",
    "hold": "hold_call", "end": "end_call"
})
builder.add_edge("tools", "agent")
graph = builder.compile()`;

const agentYaml = `spec_version: 0.1.0
name: call-support-agent
version: 0.1.0
description: AI voice customer support agent for Acme Corporation
model:
  preferred: claude-sonnet-4-6
tools:
  - next-action
  - upsert-memory`;

const soulMd = `# Soul

## Core Identity
You are an AI customer support representative for Acme Corporation.

## Core Responsibilities
- Greet the customer and collect their name and issue
- Attempt to resolve the issue before escalating
- Route to the appropriate department if escalation is needed
- Always call next_action after each customer response

## Communication Guidelines
- Use clear, concise, voice-optimized language
- Confirm customer consent before any transfer`;

const rulesMd = `# Rules

- Always attempt resolution before escalating
- Collect customer name and issue before routing
- Confirm consent before any transfer
- Do not fabricate department numbers`;

const toolNextAction = `name: next-action
description: Update conversation flow — continue, transfer to a department, hold, or end the call.
input_schema:
  type: object
  properties:
    action:
      type: string
      enum: [continue, transfer, hold, wait, end]
      description: The next action to take
    transfer_reason:
      type: string
      description: Reason for transfer (required if action is transfer)
    transfer_number:
      type: string
      description: Department phone number to transfer to
  required:
    - action`;

const toolUpsertMemory = `name: upsert-memory
description: Store or update a customer memory entry indexed by caller phone number.
input_schema:
  type: object
  properties:
    content:
      type: string
      description: The information to store (e.g. customer statement or preference)
    context:
      type: string
      description: Additional context about when or how this information was obtained
    memory_id:
      type: string
      description: UUID of existing memory to update (omit to create new)
  required:
    - content
    - context`;

const validateCmd = `opengap validate -d ./call-support-agent-opengap
opengap info -d ./call-support-agent-opengap`;

const mapping = [
  ["configurable.system_prompt (from prompt.py)", "SOUL.md + RULES.md"],
  ["configurable.model (from configuration.py)", "agent.yaml → model.preferred"],
  ["tools list (next_action, upsert_memory)", "agent.yaml → tools[] + tools/<name>.yaml"],
  ["Each tool function docstring + args", "tools/<name>.yaml description + input_schema"],
  ["StateGraph nodes (speak, conversation, transfer_call…)", "stays in framework — voice/Twilio runtime"],
  ["ChatPromptTemplate + memory formatting", "stays in framework — prompt composition"],
  ["Twilio TwiML (VoiceResponse, gather, dial)", "stays in framework — voice infrastructure"],
];

const steps = [
  { step: "1", desc: "Extract the SYSTEM_PROMPT from prompt.py → split into SOUL.md (identity, responsibilities) and RULES.md (must/never constraints)." },
  { step: "2", desc: "Take configurable.model from configuration.py → write to agent.yaml → model.preferred (e.g. claude-sonnet-4-6)." },
  { step: "3", desc: "List each function in the tools list → add kebab-case to agent.yaml → tools (next_action → next-action, upsert_memory → upsert-memory)." },
  { step: "4", desc: "Create tools/<name>.yaml for each tool — copy the docstring as description and the typed parameters as input_schema." },
  { step: "5", desc: "StateGraph nodes (speak, conversation, transfer_call, hold_call), Twilio TwiML, and memory store logic stay in graph.py — they are voice-call runtime wiring." },
  { step: "6", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookLangChain() {
  return (
    <section id="cookbook-langchain" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">LangChain → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">cris-m/langgraph_examples</code> call support agent — a voice-based
            customer support agent using LangChain + LangGraph + Twilio. The agent identity lives in
            <code className="text-primary text-xs"> prompt.py</code>; the graph wiring and Twilio infrastructure stay in the framework.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The LangChain project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Voice customer support with call routing, memory, and Twilio integration:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">prompt.py</code> — system prompt:</p>
              <CodeBlock code={promptPy} filename="agent/prompt.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools.py</code> — tool definitions:</p>
              <CodeBlock code={toolsPy} filename="agent/tools.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">graph.py</code> — StateGraph (excerpt):</p>
              <CodeBlock code={graphPy} filename="agent/graph.py" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>LangChain (call_support_agent)</span><span>OpenGAP</span>
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
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">SOUL.md</code> — identity from SYSTEM_PROMPT:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">RULES.md</code> — hard constraints from SYSTEM_PROMPT:</p>
              <CodeBlock code={rulesMd} filename="RULES.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/next-action.yaml</code>:</p>
              <CodeBlock code={toolNextAction} filename="tools/next-action.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/upsert-memory.yaml</code>:</p>
              <CodeBlock code={toolUpsertMemory} filename="tools/upsert-memory.yaml" />
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
