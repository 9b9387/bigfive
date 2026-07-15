"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { drawFakeQr } from "@/lib/draw";

interface Props {
  price: number;
  onPaid: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function CheckoutModal({ price, onPaid, onBack, onClose }: Props) {
  const [tab, setTab] = useState<"wx" | "zfb">("wx");
  const [paid, setPaid] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!paid && qrRef.current) drawFakeQr(qrRef.current, tab === "wx" ? 1 : 2);
  }, [tab, paid]);

  useEffect(() => {
    if (!paid) return;
    const t = setTimeout(onPaid, 1400);
    return () => clearTimeout(t);
  }, [paid, onPaid]);

  if (paid) {
    return (
      <Modal onClose={onClose}>
        <div className="success-wrap">
          <div className="success-circle">
            <svg viewBox="0 0 52 52"><path d="M14 27 L 22 35 L 38 17" /></svg>
          </div>
          <h3>支付成功</h3>
          <p className="modal-sub">正在为你揭开完整报告…</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3>确认支付</h3>
      <p className="modal-sub">{price < 20 ? "解锁本份完整报告" : "全年会员 · 无限测试"}</p>
      <div className="pay-tabs">
        <div className={`pay-tab wx${tab === "wx" ? " on" : ""}`} onClick={() => setTab("wx")}>
          微信支付
        </div>
        <div className={`pay-tab zfb${tab === "zfb" ? " on" : ""}`} onClick={() => setTab("zfb")}>
          支付宝
        </div>
      </div>
      <div className="qr-box"><canvas ref={qrRef} width={200} height={200} /></div>
      <div className="pay-amount">¥ {price}</div>
      <p className="pay-hint">
        demo 演示:此处为占位二维码,不产生真实扣款
      </p>
      <button className="btn" onClick={() => setPaid(true)}>我已完成支付</button>
      <button className="btn ghost" style={{ marginTop: 10 }} onClick={onBack}>← 返回选择方案</button>
    </Modal>
  );
}
