"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

interface Props {
  invites: number;
  dealEnd: number;
  onExtendDeal: () => void;
  onCheckout: (price: number) => void;
  onShare: () => void;
  onClose: () => void;
}

export default function PaywallModal({ invites, dealEnd, onExtendDeal, onCheckout, onShare, onClose }: Props) {
  const [cd, setCd] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.floor((dealEnd - Date.now()) / 1000));
      setCd(`${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`);
      if (left <= 0) onExtendDeal(); // demo:到点自动"续"上,永远差一点过期
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [dealEnd, onExtendDeal]);

  return (
    <Modal onClose={onClose}>
      <h3>解锁你的完整原型报告</h3>
      <p className="modal-sub">隐藏弱点 · 职业方向 · 相克原型 · 完整五维百分位</p>
      <div className="countdown">
        限时 66% OFF · 优惠剩余 <b>{cd}</b>
      </div>
      <div className="plan hot" onClick={() => onCheckout(9.9)}>
        <span className="hot-tag">92% 的人选这个</span>
        <div className="plan-info">
          <b>解锁本份完整报告</b>
          <span>一次付费,永久查看</span>
        </div>
        <div className="plan-price">
          <span className="was">¥29.9</span>
          <span className="now">¥9.9</span>
        </div>
      </div>
      <div className="plan" onClick={() => onCheckout(39)}>
        <div className="plan-info">
          <b>全年会员</b>
          <span>无限次测试 + 全部 32 种原型档案</span>
        </div>
        <div className="plan-price">
          <span className="was">¥99</span>
          <span className="now">¥39</span>
        </div>
      </div>
      <div className="divider">或者,不花一分钱</div>
      <div className="share-cta" onClick={onShare}>
        <b>邀请 3 位好友测试,免费解锁</b>
        <span>生成你的专属邀请卡片,好友点开即算助力(当前 {invites}/3)</span>
      </div>
    </Modal>
  );
}
