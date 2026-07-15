"use client";

import { useEffect, useState } from "react";
import { BARNUM, lockedSections } from "@/lib/data";
import { TestResult, scramble } from "@/lib/scoring";
import TopoMark from "./TopoMark";

interface Props {
  result: TestResult;
  unlocked: boolean;
  unlockMethod: string | null;
  revealFlash: boolean;
  onOpenPaywall: () => void;
  onOpenShare: () => void;
  onReset: () => void;
}

export default function ResultView({
  result: R, unlocked, unlockMethod, revealFlash, onOpenPaywall, onOpenShare, onReset,
}: Props) {
  const locked = !unlocked;
  const sections = lockedSections(R.arch, R.variant, R.rival);
  const fileNo = `NO. ${R.key}-${R.variant.name === "静水型" ? "S" : "T"}`;

  // 维度条入场动画:挂载后再展开到目标宽度
  const [barsIn, setBarsIn] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setBarsIn(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="screen">
      {!locked && (
        <div className="unlocked-badge">
          完整报告已解锁{unlockMethod === "share" ? "(好友助力)" : "(已购买)"}
        </div>
      )}
      <div className="result-head">
        <div className="specimen">
          <TopoMark size={132} className="ring" />
          <span className="glyph">{R.arch.icon}</span>
        </div>
        <p className="file-no">原型档案 {fileNo}</p>
        <div className="arch-name">{R.arch.name}</div>
        <div>
          <span className="arch-variant">{R.variant.name}</span>
          <span className="rarity-pill">
            人群稀有度 {R.rarity}%
          </span>
        </div>
        <p className="tagline">{R.arch.tagline} · {R.variant.desc}</p>
      </div>
      <p className="barnum">{BARNUM}</p>

      <div className={`card${locked ? " locked" : ""}${revealFlash ? " reveal-flash" : ""}`}>
        <div className="section-title">五维人格地貌</div>
        {R.dimValues.map((d) => (
          <div className="dim-row" key={d.name}>
            <span className="dim-name">{d.name}</span>
            <div className="dim-bar">
              <div className="dim-fill" style={{ width: barsIn ? `${d.val}%` : "0%" }} />
            </div>
            <span className={`dim-val${locked && d.secret ? " secret" : ""}`}>
              {locked && d.secret ? "██" : `前 ${100 - d.val}%`}
            </span>
          </div>
        ))}
        <p className="dim-note">百分位基于样本常模:「前 20%」表示该维度得分超过 80% 的人。</p>

        <div className="locked-zone">
          <div className="lockable">
            {sections.map((s) => (
              <div key={s.title}>
                <div className="section-title">{s.title}</div>
                <p style={{ fontSize: 14, color: "var(--ink-dim)" }}>
                  {locked ? scramble(s.body) : s.body}
                </p>
              </div>
            ))}
          </div>
          {locked && (
            <div className="lock-overlay">
              <svg className="lock-ico" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
              </svg>
              <p>
                <b>你最想知道的 3 个答案已生成</b>
                <br />
                隐藏弱点 · 职业方向 · 相克原型
              </p>
              <button className="btn" onClick={onOpenPaywall}>解锁完整报告</button>
              <span className="unlock-count">已有 683,204 人解锁</span>
            </div>
          )}
        </div>
      </div>

      {!locked && (
        <div style={{ marginTop: 18 }}>
          <button className="btn" onClick={onOpenShare}>生成我的原型海报</button>
          <button className="btn ghost" style={{ marginTop: 10 }} onClick={onReset}>再测一次</button>
        </div>
      )}
    </div>
  );
}
