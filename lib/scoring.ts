import { Archetype, DIMS, DimKey, Variant, getContent } from "./content";

export interface DimValue {
  name: string;
  val: number; // 0~100 占位百分位
  secret: boolean; // 锁定态下是否打码
}

export interface TestResult {
  arch: Archetype;
  rival: Archetype;
  variant: Variant;
  rarity: string;
  dimValues: DimValue[];
  key: string;
}

// 标准量表计分: 每题 是=2/否=0(反向翻转),每维求和(0~8),≥5 判为高。
// 百分位为 demo 占位换算;正式上线应替换为真实作答数据建立的常模。
export function computeResult(answers: number[]): TestResult {
  const { questions, archetypes, variants, dimNames } = getContent();
  const raw: Record<DimKey, number> = { explore: 0, action: 0, empathy: 0, order: 0, calm: 0 };
  questions.forEach((q, i) => {
    const v = answers[i] ?? 0;
    raw[q.dim] += q.rev ? 2 - v : v;
  });
  const seed = DIMS.reduce((s, d, i) => s + raw[d] * (7 + i * 3), 0);
  const typeDims: DimKey[] = ["explore", "action", "empathy", "order"];
  const key = typeDims.map((d) => (raw[d] >= 5 ? "1" : "0")).join("");
  const rivalKey = key.split("").map((c) => (c === "1" ? "0" : "1")).join("");
  const arch = archetypes[key];
  const rival = archetypes[rivalKey];
  const variant = raw.calm >= 5 ? variants.still : variants.tide;
  const rarity = (2.2 + (seed % 47) / 10).toFixed(1);
  // 最高与最低两维免费展示,中间三维打码 → 好奇心缺口
  const sorted = [...DIMS].sort((a, b) => raw[b] - raw[a]);
  const freeDims = new Set([sorted[0], sorted[4]]);
  const dimValues = DIMS.map((d) => ({
    name: dimNames[d],
    val: Math.min(97, Math.max(4, Math.round(6 + (raw[d] / 8) * 88 + ((seed + d.length) % 5) - 2))),
    secret: !freeDims.has(d),
  }));
  return { arch, rival, variant, rarity, dimValues, key };
}

// 锁定时用乱序占位文本(模糊之下隐约"有内容",但即使去掉 blur 也读不到真答案)
export function scramble(text: string): string {
  return text.replace(/[^,。「」——;:·%\s]/g, (c) =>
    "的一是在有人这中大为上个到说们和地出道你我他".charAt((c.charCodeAt(0) * 7) % 24) || c
  );
}
