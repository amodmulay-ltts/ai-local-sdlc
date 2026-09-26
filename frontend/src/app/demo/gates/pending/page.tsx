'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { gateDecision } from '../../data';

type Choice = 'approve' | 'changes' | 'escalate' | null;

export default function GateDecisionPage() {
  const g = gateDecision;
  const [choice, setChoice] = useState<Choice>('approve');
  const [note, setNote] = useState(g.approverNote);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="Stop 5 of 7"
        title="Playbook Run Requires Decision"
        description={`Playbook: ${g.playbook} · Project: ${g.project} · Waiting since ${g.waitingSince}`}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Why this gate?</h2>
        <p className="text-sm text-slate-400 mb-4">Step 3 (Parallel Reviews) identified disagreement:</p>
        <div className="space-y-2 mb-4">
          {g.reviews.map((r) => (
            <div key={r.reviewer} className="flex items-start gap-2 text-sm">
              <span className={r.flagged ? 'text-amber-400' : 'text-emerald-400'}>{r.flagged ? '⚠️' : '✅'}</span>
              <p className="text-slate-300">
                <span className="font-medium text-slate-200">{r.reviewer}:</span> &ldquo;{r.verdict}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-1 mb-4">
          <p className="text-slate-300 font-semibold mb-1">Judge Agent Analysis</p>
          <p className="text-slate-400">
            Disagreement level: <span className="text-amber-400">{g.judgeAnalysis.disagreementLevel}</span>
          </p>
          <p className="text-slate-400">
            Uncertainty score: <span className="text-amber-400">{g.judgeAnalysis.uncertaintyScore}</span> (threshold:{' '}
            {g.judgeAnalysis.threshold})
          </p>
          <p className="text-slate-400">
            Escalation triggered: <span className="text-amber-400">YES</span>
          </p>
        </div>

        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-200">
            <span className="font-semibold">Recommendation:</span> {g.recommendation}
          </p>
        </div>
      </div>

      {!submitted ? (
        <>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Decision options</h2>
          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer">
              <input
                type="radio"
                name="choice"
                checked={choice === 'approve'}
                onChange={() => setChoice('approve')}
                className="mt-1 accent-cyan-500"
              />
              <div>
                <p className="font-medium text-white text-sm">Approve & proceed</p>
                <p className="text-xs text-slate-400 mt-1">
                  Accept output despite disagreement. Expert judgment that Review C findings are acceptable.
                  Requires an approver note.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer">
              <input
                type="radio"
                name="choice"
                checked={choice === 'changes'}
                onChange={() => setChoice('changes')}
                className="mt-1 accent-cyan-500"
              />
              <div>
                <p className="font-medium text-white text-sm">Request changes</p>
                <p className="text-xs text-slate-400 mt-1">
                  Send back to the Requirements Agent to address the specific gaps reviewers flagged, then restart
                  from Step 5.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer">
              <input
                type="radio"
                name="choice"
                checked={choice === 'escalate'}
                onChange={() => setChoice('escalate')}
                className="mt-1 accent-cyan-500"
              />
              <div>
                <p className="font-medium text-white text-sm">Escalate to architect</p>
                <p className="text-xs text-slate-400 mt-1">
                  This requires a higher-level decision. Route to Tech Lead (~1h), Architect (~4h), or both (~6h).
                </p>
              </div>
            </label>
          </div>

          {choice === 'approve' && (
            <div className="mb-6">
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Approver note (mandatory)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <button
            onClick={() => setSubmitted(true)}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors"
          >
            {choice === 'approve' ? 'Approve & Proceed' : choice === 'changes' ? 'Request Changes' : 'Escalate'}
          </button>
        </>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <p className="text-emerald-400 font-semibold text-sm mb-1">
            ✅ Decision recorded (demo only — nothing was actually submitted)
          </p>
          <p className="text-sm text-slate-300 whitespace-pre-line">{note}</p>
          <button onClick={() => setSubmitted(false)} className="mt-3 text-xs text-slate-400 hover:text-white underline">
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
