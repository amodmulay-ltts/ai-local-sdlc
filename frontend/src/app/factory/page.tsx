import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Activity,
  ShieldCheck,
  FileCheck2,
  GitBranch,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import IntakeFlow from './components/IntakeFlow';
import VCycle from './components/VCycle';
import ReviewBottleneck from './components/ReviewBottleneck';
import AILadder from './components/AILadder';
import PageHeader from './components/PageHeader';
import { coreTerms } from './data';

// Act 1: the problem. Copilots speed up people, but the value leaks in the handoffs.
// Act 2: the idea. Four parts, each with one job.
// Act 3: the flow. A request enters through intake and runs as a chain of playbooks.
// Act 4: inside one playbook. Every step follows the same seven moves.
// Act 5: explore, then see what exists today, then the next step.

const fourParts = [
  {
    icon: BookOpen,
    term: 'Playbook',
    job: 'Defines the work',
    detail: 'A versioned workflow: its steps, agents, gates, and the evidence it must produce.',
  },
  {
    icon: Cpu,
    term: 'Agent',
    job: 'Does one bounded task',
    detail: 'Drafting, judging, or reviewing. An agent is one part of a step, never the whole process.',
  },
  {
    icon: ShieldCheck,
    term: 'Gate',
    job: 'Decides whether to continue',
    detail: 'A checkpoint with explicit criteria. A machine or a person decides, and the outcome is recorded.',
  },
  {
    icon: FileCheck2,
    term: 'Evidence',
    job: 'Proves the result',
    detail: 'The sources, artifacts, test results, reviews, and approvals behind every claim.',
  },
];

// One playbook step (docs/CONCEPT.md §4).
const stepFlow = [
  { title: 'Resolve inputs', detail: 'From governed knowledge and earlier steps' },
  { title: 'Assemble context', detail: 'Allowed sources only' },
  { title: 'Agent executes', detail: 'A bounded role, through the model router' },
  { title: 'Validate output', detail: 'Schema and deterministic checks' },
  { title: 'Evaluate gate', detail: 'Continue, retry, pause, or ask a person' },
  { title: 'Record evidence', detail: 'Inputs, outputs, and the decision' },
  { title: 'Deliver or rework', detail: 'Accepted work moves on' },
];

const exploreViews = [
  {
    href: '/factory/dashboard',
    icon: LayoutDashboard,
    title: 'Factory dashboard',
    description: 'Runs in progress, the approval queue, autonomy, cycle time, and tokens.',
  },
  {
    href: '/factory/playbooks',
    icon: BookOpen,
    title: 'Playbook library',
    description: 'The V-cycle library (U1–U9). U1 is the first slice to build.',
  },
  {
    href: '/factory/agents',
    icon: Cpu,
    title: 'Agent roles',
    description: 'The bounded roles (Orchestrator, SpecWriter, Builder, Reviewers, Judge, Approver, Human gate) and the model each one uses.',
  },
  {
    href: '/factory/runs/live',
    icon: Activity,
    title: 'A run in progress',
    description: 'Completed steps, parallel independent reviews, and evidence as it accumulates.',
  },
  {
    href: '/factory/gates/pending',
    icon: ShieldCheck,
    title: 'A human gate',
    description: 'Where reviewers disagree, the run escalates. A person decides with the full context.',
  },
  {
    href: '/factory/evidence/requirements-run',
    icon: FileCheck2,
    title: 'The evidence package',
    description: 'Inputs, outputs, independent reviews, disagreements, and the decision. Exportable.',
  },
  {
    href: '/factory/traceability',
    icon: GitBranch,
    title: 'Traceability',
    description: 'Every requirement traced to its code, tests, cost, and production telemetry.',
  },
];

type BuildStatus = 'Implemented' | 'Deferred' | 'Planned' | 'Illustrative';

const buildStatus: Array<{ area: string; status: BuildStatus; detail: string }> = [
  { area: 'Repository and tooling (M0)', status: 'Implemented', detail: 'Python project, Docker Compose Postgres with pgvector, Alembic, lint and test tooling' },
  { area: 'Data model and CRUD API (M1)', status: 'Implemented', detail: 'Project, ModelProfile, KnowledgeSource, Chunk, CallLog; FastAPI routes' },
  { area: 'Model layer (M2)', status: 'Implemented', detail: 'LLMProvider interface, Ollama adapter for local models, server-side local-only policy, per-call token logging' },
  { area: 'Cloud model adapter (Claude)', status: 'Deferred', detail: 'Comes after the local path. Cloud profiles are rejected until then' },
  { area: 'Ingestion and retrieval (M3–M4)', status: 'Planned', detail: 'Document parsing, embeddings, and pgvector search are not built' },
  { area: 'Orchestrator and playbook engine (M5–M6)', status: 'Planned', detail: 'The YAML playbook parser and run loop are not built' },
  { area: 'Intake playbook U0 (§4.1)', status: 'Planned', detail: 'Source connectors, deduplication, classification, and routing are designed, not built' },
  { area: 'Agents, judge, evidence and gates (M7–M9)', status: 'Planned', detail: 'The agent roles, judge, and gate model are designed, not built' },
  { area: 'This view', status: 'Illustrative', detail: 'Figures are illustrative. No page calls the backend' },
];

const statusStyle: Record<BuildStatus, string> = {
  Implemented: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
  Deferred: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
  Planned: 'bg-slate-100 dark:bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/30',
  Illustrative: 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30',
};

const sectionTitle = 'text-lg font-semibold text-slate-900 dark:text-white mb-2';
const sectionLead = 'text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-3xl';
const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

export default function FactoryOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI-native engineering delivery"
        title="The Factory, Not the Copilot"
        description="Project material goes in as governed knowledge. Reviewed, traceable engineering artifacts come out, with a person accountable at every gate that matters. The figures here are illustrative; what is built today is listed at the end."
      />

      {/* 1. The problem */}
      <section className="mb-12">
        <div className={`${card} p-6`}>
          <h2 className={sectionTitle}>The problem</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            AI copilots make individual engineers faster, but releases don&apos;t move. The value leaks in the handoffs
            <em> between</em> functions, not inside them: requirements to design, design to code, code to tests.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The factory automates the whole chain instead. Governed knowledge drives requirements, architecture, design,
            code, and tests. Independent reviewers check each artifact, and gates enforce quality and human accountability
            before anything is accepted.
          </p>
        </div>
      </section>

      {/* 1a. Where AI use stands today */}
      <section className="mb-12">
        <h2 className={sectionTitle}>Where AI use stands today</h2>
        <p className={sectionLead}>
          Most AI use has stayed at the first two rungs. Each rung up reaches further into the work, and the last one covers
          the whole path from a request to a release.
        </p>
        <AILadder />
      </section>

      {/* 1b. The bottleneck moves to review */}
      <section className="mb-12">
        <h2 className={sectionTitle}>Faster output is only useful if review keeps up</h2>
        <p className={sectionLead}>
          AI makes each stage faster. A team that used to open two or three pull requests a day could open forty. If a
          person still reads every one, the queue becomes the bottleneck and the end result barely changes. The factory
          moves human effort from reading everything to deciding the few things that need a person.
        </p>
        <ReviewBottleneck />
      </section>

      {/* 2. The idea */}
      <section className="mb-12">
        <h2 className={sectionTitle}>The idea: four parts</h2>
        <p className={sectionLead}>Every part has one job. Together they turn &ldquo;trust the model&rdquo; into &ldquo;check the evidence&rdquo;.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          {fourParts.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.term} className={`${card} p-5`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={18} className="text-cyan-600 dark:text-cyan-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">{t.term}</h3>
                </div>
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400 mb-2">{t.job}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t.detail}</p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {coreTerms.map((t) => (
            <div key={t.term} className="px-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{t.term}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The V-cycle: what happens at each stage */}
      <section className="mb-12">
        <h2 className={sectionTitle}>The V-cycle: what happens at each stage</h2>
        <p className={sectionLead}>
          The work is split into stages, and each stage is one playbook. The left arm specifies the work, the bottom
          builds it, and the right arm verifies it. Every specification is checked by the stage opposite it, so nothing is
          accepted on the author&apos;s word.
        </p>
        <VCycle />
      </section>

      {/* 4. The flow: from one request to a release */}
      <section className="mb-12">
        <h2 className={sectionTitle}>From one request to a release</h2>
        <p className={sectionLead}>
          A request from a chat thread, a tracker, or a webhook starts intake. Intake is a playbook too. It hands the request
          to the V-cycle, where each playbook starts the next as a child run. The source reference travels with the work
          all the way to the code and tests.
        </p>
        <IntakeFlow />
      </section>

      {/* 5. Inside one playbook */}
      <section className="mb-12">
        <h2 className={sectionTitle}>Inside one playbook step</h2>
        <p className={sectionLead}>
          Every step, in every playbook, follows the same seven moves. Rejected output goes back for rework, capped at a set
          number of iterations. High-risk work always needs a person&apos;s approval, even when every automated check passes.
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-3">
          {stepFlow.map((step, idx) => (
            <li key={step.title} className={`${card} p-4`}>
              <p className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400 mb-1">{idx + 1}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{step.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{step.detail}</p>
            </li>
          ))}
        </ol>
        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          <RotateCcw size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>The rework loop is capped. The record of every iteration is evidence, so a reviewer can see what changed and why.</p>
        </div>
      </section>

      {/* 5. Explore */}
      <section className="mb-12">
        <h2 className={sectionTitle}>Explore the concept</h2>
        <p className={sectionLead}>Follow one requirement from the dashboard, to a gate, to its evidence, to the code and tests behind it.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exploreViews.map((view) => {
            const Icon = view.icon;
            return (
              <Link
                key={view.href}
                href={view.href}
                className="group flex items-start gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/40 rounded-xl p-5 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 transition-colors shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{view.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{view.description}</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Where we are */}
      <section className="mb-12">
        <h2 className={sectionTitle}>Where we are today</h2>
        <p className={sectionLead}>
          The concept is complete on paper. The foundation is built: the data model and the local model layer. The
          orchestrator, the playbook engine, and the agents come next.
        </p>
        <div className={`${card} divide-y divide-slate-200 dark:divide-slate-800`}>
          {buildStatus.map((row) => (
            <div key={row.area} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{row.area}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{row.detail}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyle[row.status]}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Next */}
      <section>
        <div className={`${card} p-6`}>
          <h2 className={sectionTitle}>The next step</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            The first vertical slice is U1, intent to requirements. It runs from a single request through a drafting agent,
            an independent judge from a different model family, and a human approval, and it keeps the evidence for every
            decision. Once that slice is measured, the rest of the V-cycle follows.
          </p>
          <Link href="/factory/playbooks" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-cyan-400 hover:underline">
            See the U1 playbook
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
