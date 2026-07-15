/* ================================================================
   内容加载层:全部可编辑内容都在 public/content.json,运行时动态加载。
   改题目/原型名/文案只需编辑 JSON,无需改代码。
   ================================================================ */

export type DimKey = "explore" | "action" | "empathy" | "order" | "calm";

// 维度顺序是计分结构的一部分(前四维定原型,第五维定型态),固定在代码里
export const DIMS: DimKey[] = ["explore", "action", "empathy", "order", "calm"];

export interface Question {
  t: string;
  dim: DimKey;
  rev?: boolean; // 反向计分
}

export interface Archetype {
  icon: string;
  name: string;
  tagline: string;
}

export interface Variant {
  name: string;
  desc: string;
}

export interface LockedSectionTemplate {
  title: string;
  body: string; // 支持占位符 {arch} {variant} {variantClause} {rival} {rivalIcon}
}

export interface Content {
  dimNames: Record<DimKey, string>;
  questions: Question[];
  archetypes: Record<string, Archetype>;
  variants: { still: Variant; tide: Variant };
  barnum: string;
  lockedSections: LockedSectionTemplate[];
  variantClauses: Record<string, string>;
  teases: Record<string, string>;
  anaSteps: string[];
  toastPool: [string, string][];
}

let cache: Content | null = null;

export async function loadContent(): Promise<Content> {
  if (!cache) {
    const res = await fetch("/content.json");
    if (!res.ok) throw new Error(`加载 content.json 失败: ${res.status}`);
    cache = (await res.json()) as Content;
  }
  return cache;
}

// 页面在 loadContent 完成前不渲染主流程,因此组件内可安全同步读取
export function getContent(): Content {
  if (!cache) throw new Error("content.json 尚未加载,请先调用 loadContent()");
  return cache;
}

export interface LockedSection {
  title: string;
  body: string;
}

// 渲染锁定板块:将模板占位符替换为当前结果
export function lockedSections(arch: Archetype, variant: Variant, rival: Archetype): LockedSection[] {
  const c = getContent();
  const vars: Record<string, string> = {
    arch: arch.name,
    variant: variant.name,
    variantClause: c.variantClauses[variant.name] ?? "",
    rival: rival.name,
    rivalIcon: rival.icon,
  };
  return c.lockedSections.map((s) => ({
    title: s.title,
    body: s.body.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ""),
  }));
}
