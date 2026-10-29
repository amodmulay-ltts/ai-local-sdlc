import { ArrowRight, BookOpen, Layers, Cpu, Radio, ShieldCheck, Inbox, GitBranch, CheckCircle2, Circle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

// How the factory is set up. This is a process view for the concept: the actions and the
// artifacts are shown, but nothing here saves or runs. Illustrative values, automotive examples.

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';
const sectionTitle = 'text-lg font-semibold text-slate-900 dark:text-white mb-2';
const sectionLead = 'text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-3xl';

const buildOrder = [
  { icon: Cpu, name: 'Agent', does: 'A role with a model profile and a prompt' },
  { icon: BookOpen, name: 'Playbook', does: 'Steps that use agents, with gates' },
  { icon: Layers, name: 'Line', does: 'Pins playbook versions and sets routing' },
  { icon: Radio, name: 'Trigger', does: 'A source event mapped to a line' },
  { icon: Inbox, name: 'Work order', does: 'Created on the line, then run' },
];

type Step = { title: string; detail: string };

const playbookSteps: Step[] = [
  { title: 'Draft the playbook', detail: 'Name it, then list its stages, steps, and gates.' },
  { title: 'Attach the prompts', detail: 'One prompt file per agent role used in the playbook.' },
  { title: 'Check the contract', detail: 'Inputs and outputs connect, and every gate names an approver role.' },
  { title: 'Review', detail: 'The process owner reviews the change, the same way code is reviewed.' },
  { title: 'Publish a version', detail: 'Lines can pin this version and move to a newer one later.' },
];

const lineSteps: Step[] = [
  { title: 'Name the line and its owner', detail: 'One product line, with one accountable owner.' },
  { title: 'Connect knowledge', detail: 'The line\'s own sources. Shared sources are linked explicitly.' },
  { title: 'Set the model policy', detail: 'Local-only, or cloud profiles allowed. Lines may be stricter than the factory.' },
  { title: 'Set the routing table', detail: 'Which playbook starts for each kind of request.' },
  { title: 'Name the approvers', detail: 'A person for each gate, and a deadline for each decision.' },
  { title: 'Map the trigger sources', detail: 'Tracker projects and chat channels that feed this line.' },
];

const agentSteps: Step[] = [
  { title: 'Name the role and its job', detail: 'One bounded responsibility, such as drafting requirements.' },
  { title: 'Pick a model profile', detail: 'Local-fast, local-strong, or a second model family for judging.' },
  { title: 'Attach a prompt file', detail: 'The instructions the role follows. Versioned with the agent.' },
  { title: 'Allow only the tools it needs', detail: 'Read-only search by default. Write access is granted explicitly.' },
  { title: 'Define the output', detail: 'The schema its result must match, so the next step can read it.' },
  { title: 'Test on a fixed input', detail: 'Run it against a known example before any playbook uses it.' },
];

const triggerSteps: Step[] = [
  { title: 'Register the connector once', detail: 'Factory level: the tracker and chat connections are set up once, for all lines.' },
  { title: 'Map each source to a line', detail: 'A tracker project or chat channel belongs to exactly one line.' },
  { title: 'Send a sample event', detail: 'Check that it lands on the right line and creates a work order.' },
  { title: 'Handle the unmapped', detail: 'Events that match no line go to a factory-admin queue, not to a guess.' },
];

const stitched: Step[] = [
  { title: 'An event arrives', detail: 'A tracker issue is created in the IVI project.' },
  { title: 'The line is found', detail: 'The source mapping gives the IVI development line, and a work order is opened.' },
  { title: 'Intake runs', detail: 'U0 classifies the request, then routes it with the line’s routing table.' },
  { title: 'The chain starts', detail: 'The handoff starts U1 as a child run. Each playbook starts the next one.' },
  { title: 'Agents do the steps', detail: 'Each agent call uses its profile, and the line policy is checked before any provider is used.' },
  { title: 'Gates decide', detail: 'Where a gate opens, the named approver decides and the decision is recorded.' },
  { title: 'Evidence and traceability', detail: 'Every step is recorded, so the work order can be traced from source to release.' },
];

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{s.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ActionChip({ label }: { label: string }) {
  return (
    <span
      title="Illustrative: this action is not connected"
      className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400"
    >
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 py-2 text-xs">
      <dt className="text-slate-500 dark:text-slate-500">{label}</dt>
      <dd className="text-right text-slate-800 dark:text-slate-200">{value}</dd>
    </div>
  );
}

export default function SetupPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Setup · how the factory is configured"
        title="Setting up the factory"
        description="How a playbook, a line, an agent, and a trigger come into being, and how they connect. This view shows the process and the artifacts. Nothing here saves or runs; the actions are illustrative."
      />

      {/* Build order */}
      <section className="mb-12">
        <h2 className={sectionTitle}>Build order</h2>
        <p className={sectionLead}>Each piece depends on the one before it. Agents come first, and triggers last.</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
          {buildOrder.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={b.name} className="flex md:block items-center gap-3">
                <div className={`${card} p-4 flex-1 h-full`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} className="text-cyan-600 dark:text-cyan-400" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{b.name}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{b.does}</p>
                </div>
                {i < buildOrder.length - 1 && <ArrowRight size={14} className="hidden md:block mx-auto my-2 text-slate-400 dark:text-slate-600 rotate-0" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Playbook */}
      <section className="mb-12">
        <h2 className={sectionTitle}>1. Create a playbook</h2>
        <p className={sectionLead}>A playbook is a versioned file, reviewed like code. Lines use it by version.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`${card} p-5`}>
            <StepList steps={playbookSteps} />
            <div className="flex flex-wrap gap-2 mt-5">
              <ActionChip label="New playbook" />
              <ActionChip label="Validate contract" />
              <ActionChip label="Publish version" />
            </div>
          </div>
          <div className={`${card} p-5`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Example: U1 intent-to-requirements, excerpt</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
{`id: intent-to-requirements
version: 0.3
inputs: [handoff_contract]
outputs: [requirements_spec, review_evidence]
steps:
  - id: draft
    agent: spec-writer        # a role, defined separately
    profile: local-strong
  - id: judge
    agent: judge
    profile: local-strong     # second model family
gates:
  - id: human-review
    when: uncertainty > 0.30
    approver_role: line-product-owner
max_iterations: 3`}
            </pre>
          </div>
        </div>
      </section>

      {/* Line */}
      <section className="mb-12">
        <h2 className={sectionTitle}>2. Create a line</h2>
        <p className={sectionLead}>A line is one product&apos;s production line. It owns its knowledge, routing, approvers, and policy.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`${card} p-5`}>
            <StepList steps={lineSteps} />
            <div className="flex flex-wrap gap-2 mt-5">
              <ActionChip label="New line" />
              <ActionChip label="Add knowledge source" />
              <ActionChip label="Set routing" />
              <ActionChip label="Assign approvers" />
            </div>
          </div>
          <div className={`${card} p-5`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Example: IVI development</p>
            <dl>
              <Field label="Owner" value="IVI product owner" />
              <Field label="Model policy" value="Local-only" />
              <Field label="Knowledge" value="navigation-requirements.pdf, hmi-style-guide.md" />
              <Field label="Routing: new requirement" value="U1 intent-to-requirements" />
              <Field label="Routing: defect" value="U4 design-to-implementation" />
              <Field label="Routing: change request" value="U1 intent-to-requirements" />
              <Field label="Approver: U1 gate" value="IVI product owner" />
              <Field label="Approver: U8 gate" value="IVI product owner" />
              <Field label="Time target: at a gate" value="24 hours" />
            </dl>
          </div>
        </div>
      </section>

      {/* Agent */}
      <section className="mb-12">
        <h2 className={sectionTitle}>3. Create an agent</h2>
        <p className={sectionLead}>An agent is a role, not a program. Playbook steps refer to it by name, so one agent serves many playbooks.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`${card} p-5`}>
            <StepList steps={agentSteps} />
            <div className="flex flex-wrap gap-2 mt-5">
              <ActionChip label="New agent" />
              <ActionChip label="Test on fixed input" />
            </div>
          </div>
          <div className={`${card} p-5`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Example: SpecWriter</p>
            <dl>
              <Field label="Responsibility" value="Turns a brief into a numbered requirements draft" />
              <Field label="Model profile" value="local-strong" />
              <Field label="Prompt" value="spec-writer v3" />
              <Field label="Tools" value="Read-only search of line knowledge" />
              <Field label="Output" value="RequirementsDraft" />
              <Field label="Used in" value="U1, U2, U3, U6" />
              <Field label="Test" value="Passed on the fixed IVI example, 2 days ago" />
            </dl>
          </div>
        </div>
      </section>

      {/* Trigger */}
      <section className="mb-12">
        <h2 className={sectionTitle}>4. Connect triggers to a line</h2>
        <p className={sectionLead}>
          A trigger is an event from a source system: a tracker issue, a chat message. The connector is set up once for the
          factory, and each source is mapped to one line.
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`${card} p-5`}>
            <StepList steps={triggerSteps} />
            <div className="flex flex-wrap gap-2 mt-5">
              <ActionChip label="Register connector" />
              <ActionChip label="Map source to line" />
              <ActionChip label="Send sample event" />
            </div>
          </div>
          <div className={`${card} p-5`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">Source mappings</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 font-medium">Source</th>
                  <th className="py-2 font-medium">Key</th>
                  <th className="py-2 font-medium">Line</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {[
                  ['Tracker', 'IVI', 'IVI development', 'Mapped'],
                  ['Chat', '#ota-requests', 'OTA cloud systems', 'Mapped'],
                  ['Tracker', 'DAT', 'Data products', 'Mapped'],
                  ['Tracker', 'VD', 'Vehicle design', 'Mapped'],
                  ['Tracker', 'PT', '-', 'Unmapped, in admin queue'],
                ].map((row) => (
                  <tr key={row.join('-')} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="py-2">{row[0]}</td>
                    <td className="py-2 font-mono">{row[1]}</td>
                    <td className="py-2">{row[2]}</td>
                    <td className={`py-2 ${row[3].startsWith('Unmapped') ? 'text-amber-700 dark:text-amber-400' : ''}`}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stitched */}
      <section className="mb-12">
        <h2 className={sectionTitle}>How it all connects</h2>
        <p className={sectionLead}>One event, followed through the whole system. Each arrow is a recorded event.</p>
        <div className={`${card} p-6`}>
          <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stitched.map((s, i) => (
              <li key={s.title} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">{i + 1}</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{s.detail}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Gates and decisions recorded as evidence
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} /> Line policy checked before any provider call
            </span>
            <span className="flex items-center gap-1.5">
              <GitBranch size={12} /> Work order traced from source to release
            </span>
            <span className="flex items-center gap-1.5">
              <Circle size={12} /> Inbox and floor are views over the same events
            </span>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-slate-500">
        Illustrative. The actions shown are not connected, and nothing on this page changes configuration.
      </p>
    </div>
  );
}
