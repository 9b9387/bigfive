"use client";

import { useEffect, useState } from "react";
import { getContent } from "@/lib/content";
import TopoMark from "./TopoMark";

export default function Analyzing({ onDone }: { onDone: () => void }) {
  const { anaSteps } = getContent();
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    const timers = anaSteps.map((_, i) =>
      setTimeout(() => setLitCount(i + 1), 500 + i * 750)
    );
    const done = setTimeout(onDone, 500 + anaSteps.length * 750 + 600);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen analyzing">
      <TopoMark size={110} className="topo-spin" />
      <h2>正在绘制你的人格地貌</h2>
      <div className="ana-steps">
        {anaSteps.map((s, i) => (
          <div key={i} className={`ana-step${s.includes("检测到") ? " rare" : ""}${i < litCount ? " on" : ""}`}>
            <span className="tick">{i < litCount ? "✓" : "·"}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
