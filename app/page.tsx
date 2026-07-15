"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getContent, loadContent } from "@/lib/content";
import { computeResult } from "@/lib/scoring";
import Landing from "@/components/Landing";
import Quiz from "@/components/Quiz";
import Analyzing from "@/components/Analyzing";
import ResultView from "@/components/ResultView";
import PaywallModal from "@/components/PaywallModal";
import ShareModal from "@/components/ShareModal";
import CheckoutModal from "@/components/CheckoutModal";
import TopoMark from "@/components/TopoMark";

/* ================================================================
   付费转化 Demo — 状态机编排
   漏斗: landing → quiz → analyzing → result(锁定) → paywall → checkout/share → 解锁
   ================================================================ */

type Stage = "landing" | "quiz" | "analyzing" | "result";

interface AppState {
  stage: Stage;
  qIdx: number;
  answers: number[];
  invites: number;
  unlocked: boolean;
  unlockMethod: "pay" | "share" | null;
  dealEnd: number | null;
}

const DEFAULT_STATE: AppState = {
  stage: "landing", qIdx: 0, answers: [], invites: 0,
  unlocked: false, unlockMethod: null, dealEnd: null,
};

type ModalKind = null | { type: "paywall" } | { type: "share" } | { type: "checkout"; price: number };

interface ToastItem { id: number; content: ReactNode; out: boolean; }

export default function Home() {
  const [S, setS] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [revealFlash, setRevealFlash] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);

  // 内容(题库/原型/文案)来自 public/content.json,加载完成后再渲染主流程
  useEffect(() => {
    loadContent().then(() => setReady(true)).catch(console.error);
  }, []);

  const toast = useCallback((content: ReactNode) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts, { id, content, out: false }]);
    setTimeout(() => setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, out: true } : t))), 3600);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 4100);
  }, []);

  // 社交证明:结果页锁定期间滚动播报
  useEffect(() => {
    if (!ready || S.stage !== "result" || S.unlocked) return;
    const pool = getContent().toastPool;
    const t = setInterval(() => {
      const p = pool[Math.floor(Math.random() * pool.length)];
      toast(<>{p[0]}的 <b>{p[1]}**</b> 刚刚解锁了完整报告</>);
    }, 9000);
    return () => clearInterval(t);
  }, [ready, S.stage, S.unlocked, toast]);

  const result = useMemo(
    () => (S.stage === "result" ? computeResult(S.answers) : null),
    [S.stage, S.answers]
  );

  // ---------- 交互 ----------
  const resetDemo = () => {
    setModal(null);
    setRevealFlash(false);
    setS(DEFAULT_STATE);
  };

  const startQuiz = () => setS((s) => ({ ...s, stage: "quiz", qIdx: 0, answers: [] }));

  const answer = (v: number) =>
    setS((s) => {
      const answers = [...s.answers];
      answers[s.qIdx] = v;
      const qIdx = s.qIdx + 1;
      return { ...s, answers, qIdx, stage: qIdx >= getContent().questions.length ? "analyzing" : "quiz" };
    });

  const doUnlock = useCallback((method: "pay" | "share") => {
    setS((s) => ({ ...s, unlocked: true, unlockMethod: method }));
    setModal(null);
    setRevealFlash(true);
    toast(method === "pay" ? "支付成功,报告已解锁" : "助力完成,报告已解锁");
  }, [toast]);

  const openPaywall = () => {
    setS((s) =>
      !s.dealEnd || s.dealEnd < Date.now() ? { ...s, dealEnd: Date.now() + 599 * 1000 } : s
    );
    setModal({ type: "paywall" });
  };

  const extendDeal = useCallback(
    () => setS((s) => ({ ...s, dealEnd: Date.now() + 599 * 1000 })),
    []
  );

  const mockInvite = () => {
    if (S.invites >= 3) return;
    const invites = S.invites + 1;
    setS((s) => ({ ...s, invites }));
    const pool = getContent().toastPool;
    const p = pool[Math.floor(Math.random() * pool.length)];
    toast(<>{p[0]}的好友 <b>{p[1]}**</b> 通过你的链接开始了测试({invites}/3)</>);
    if (invites >= 3) setTimeout(() => doUnlock("share"), 900);
  };

  return (
    <div id="app">
      <div id="topbar">
        <span className="logo">
          <TopoMark size={20} />
          自然人格实验室
        </span>
      </div>

      {!ready && null /* content.json 加载中(本地静态文件,瞬时完成) */}
      {ready && S.stage === "landing" && <Landing onStart={startQuiz} />}
      {S.stage === "quiz" && <Quiz qIdx={S.qIdx} onAnswer={answer} />}
      {S.stage === "analyzing" && (
        <Analyzing onDone={() => setS((s) => ({ ...s, stage: "result" }))} />
      )}
      {S.stage === "result" && result && (
        <ResultView
          result={result}
          unlocked={S.unlocked}
          unlockMethod={S.unlockMethod}
          revealFlash={revealFlash}
          onOpenPaywall={openPaywall}
          onOpenShare={() => setModal({ type: "share" })}
          onReset={resetDemo}
        />
      )}

      {modal?.type === "paywall" && S.dealEnd && (
        <PaywallModal
          invites={S.invites}
          dealEnd={S.dealEnd}
          onExtendDeal={extendDeal}
          onCheckout={(price) => setModal({ type: "checkout", price })}
          onShare={() => setModal({ type: "share" })}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "share" && result && (
        <ShareModal
          result={result}
          unlocked={S.unlocked}
          invites={S.invites}
          onMockInvite={mockInvite}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "checkout" && (
        <CheckoutModal
          price={modal.price}
          onPaid={() => doUnlock("pay")}
          onBack={() => setModal({ type: "paywall" })}
          onClose={() => setModal(null)}
        />
      )}

      <div id="toastZone">
        {toasts.map((t) => (
          <div key={t.id} className={`toast${t.out ? " out" : ""}`}>{t.content}</div>
        ))}
      </div>
    </div>
  );
}
