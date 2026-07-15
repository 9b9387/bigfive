"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { TestResult } from "@/lib/scoring";
import { drawShareCard } from "@/lib/draw";

interface Props {
  result: TestResult;
  unlocked: boolean;
  invites: number;
  onMockInvite: () => void;
  onClose: () => void;
}

export default function ShareModal({ result, unlocked, invites, onMockInvite, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) drawShareCard(canvasRef.current, result);
  }, [result]);

  const copyInvite = () => {
    const link = "https://naturetype.demo/t/9x2kQ?from=u88231";
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(link).then(done, done);
    else done();
  };

  return (
    <Modal onClose={onClose}>
      <h3>{unlocked ? "我的原型海报" : "邀请好友,免费解锁"}</h3>
      <p className="modal-sub">
        {unlocked ? "保存图片,发给朋友测一测" : "好友通过你的卡片完成测试,即算 1 次助力"}
      </p>
      <canvas
        ref={canvasRef}
        id="shareCanvas"
        width={640}
        height={880}

      />
      {!unlocked && (
        <div className="invite-progress">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`invite-slot${i < invites ? " filled" : ""}`}>
              {i < invites ? "✓" : "?"}
            </div>
          ))}
        </div>
      )}
      <button className="btn" onClick={copyInvite}>
        {copied ? "已复制,发给好友吧" : "复制我的邀请链接"}
      </button>
      {!unlocked && (
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={onMockInvite}>
          (演示)模拟一位好友点击了链接
        </button>
      )}
    </Modal>
  );
}
