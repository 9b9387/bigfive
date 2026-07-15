"use client";

import { QUESTIONS, TEASES } from "@/lib/data";

export default function Quiz({ qIdx, onAnswer }: { qIdx: number; onAnswer: (v: number) => void }) {
  const q = QUESTIONS[qIdx];
  const pct = Math.round((qIdx / QUESTIONS.length) * 100);
  const tease = TEASES[qIdx];

  return (
    <div className="screen">
      <div className="progress-wrap">
        <div className="progress-label">
          <span className="q-no">
            {String(qIdx + 1).padStart(2, "0")} <span style={{ color: "var(--ink-dim)", fontSize: 12 }}>/ {QUESTIONS.length}</span>
          </span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {tease && (
        <div className="tease-banner">{tease}</div>
      )}
      {/* key 保证每题重放滑入动画 */}
      <div className="q-card card" key={qIdx}>
        <p className="eyebrow q-kicker">凭第一直觉判断</p>
        <div className="q-title">{q.t}</div>
        <div className="yn-row">
          <button className="yn-btn yes" onClick={() => onAnswer(2)}>是</button>
          <button className="yn-btn no" onClick={() => onAnswer(0)}>否</button>
        </div>
      </div>
    </div>
  );
}
