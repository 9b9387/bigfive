"use client";

import { useEffect, useState } from "react";
import TopoMark from "./TopoMark";

export default function Landing({ onStart }: { onStart: () => void }) {
  // 社交证明:人数缓慢跳动
  const [count, setCount] = useState(2847391);
  useEffect(() => {
    const t = setInterval(() => setCount((n) => n + Math.floor(Math.random() * 4) + 1), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="screen">
      <div className="hero">
        <TopoMark size={190} className="hero-topo" />
        <p className="eyebrow">Nature Archetype · 人格地貌测绘</p>
        <h1 className="hero-title">
          你内心住着
          <br />
          哪一种自然原型?
        </h1>
        <p className="hero-sub">20 道「是/否」判断,约 2 分钟。16 种原型,2 种型态。</p>
        <p className="hero-cred">
          基于大五人格模型,题目改编自 IPIP 国际人格题库。
        </p>
      </div>

      <div className="survey-line">
        <b>{count.toLocaleString("en-US")}</b>
        <span>人已完成测绘 · 用户评分 4.9</span>
      </div>

      <div className="review">
        <b>@雾里看花</b>测出来是深海共感者,看到隐藏弱点那段后背发凉。
      </div>
      <div className="review">
        <b>@Kenn</b>本来不信这个,测完把链接发给了全组同事。
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn" onClick={onStart}>开始测试</button>
        <p className="free-tag">测试免费 · 无需注册 · 凭直觉作答</p>
      </div>
    </div>
  );
}
