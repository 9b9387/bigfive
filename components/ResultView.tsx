"use client";

import { useEffect, useState } from "react";
import { freeInsight, getContent, lockedSections } from "@/lib/content";
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
  const { barnum, reportMeta } = getContent();
  const vars = { arch: R.arch, variant: R.variant, rival: R.rival, conflictQ: R.conflictQ, topDim: R.topDim };
  const free = freeInsight(vars);
  const sections = lockedSections(vars);
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
          <span className="rarity-pill">人群稀有度 {R.rarity}%</span>
        </div>
        <p className="tagline">{R.arch.tagline} · {R.variant.desc}</p>
      </div>
      <p className="barnum">{barnum}</p>

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
        <p className="dim-note">
          百分位基于样本常模:「前 20%」表示该维度得分超过 80% 的人。
          {locked && "打码维度将在完整报告中揭示。"}
        </p>

        {/* 免费板块:完整可读,建立"报告确实有料"的信任 */}
        <div className="section-title">{free.title}</div>
        <p className="sec-body">{free.body}</p>

        {/* 锁定板块:标题与钩子可读,正文模糊截断 —— 好奇心缺口 */}
        {sections.map((s) => (
          <div key={s.title} className="locked-sec">
            <div className="section-title">
              {s.title}
              {locked && <span className="lock-flag">已生成</span>}
            </div>
            <p className="section-hook">{s.hook}</p>
            {locked && <p className="section-stat">{s.stat}</p>}
            <p className={`sec-body lockable${locked ? " clamped" : ""}`}>
              {locked ? scramble(s.body) : s.body}
            </p>
          </div>
        ))}

        {locked && (
          <div className="cta-block">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
            <p>
              <b>你的完整报告已生成</b>
              {reportMeta.sections} 个板块 · {reportMeta.words} 字,按你的 20 组作答定制
            </p>
            <button className="btn" onClick={onOpenPaywall}>解锁完整报告</button>
            <span className="unlock-count">已有 {reportMeta.unlockCount} 人解锁 · 解锁后永久可读</span>
          </div>
        )}
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
