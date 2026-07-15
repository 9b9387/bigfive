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

// 锁定板块模板。body/hook/stat 支持占位符:
// {arch} {variant} {variantClause} {loveClause} {rival} {rivalIcon} {conflictQ} {topDim}
export interface LockedSectionTemplate {
  title: string;
  hook: string; // 可读的好奇心钩子(锁定态下不模糊)
  stat: string; // 板块元信息(字数/条目数),制造"内容量"感知
  body: string; // 正文(锁定态下模糊)
}

export interface Content {
  dimNames: Record<DimKey, string>;
  questions: Question[];
  archetypes: Record<string, Archetype>;
  variants: { still: Variant; tide: Variant };
  barnum: string;
  freeInsight: { title: string; body: string };
  lockedSections: LockedSectionTemplate[];
  variantClauses: Record<string, string>;
  variantLoveClauses: Record<string, string>;
  reportMeta: { sections: number; words: string; unlockCount: string };
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

// 模板插值所需的个人化字段(由 scoring 计算)
export interface ReportVars {
  arch: Archetype;
  variant: Variant;
  rival: Archetype;
  conflictQ: number; // 与原型模式相矛盾的题号(1 起),个人化钩子
  topDim: string; // 最高维度显示名
}

export interface LockedSection {
  title: string;
  hook: string;
  stat: string;
  body: string;
}

function interpolate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function buildVars(r: ReportVars): Record<string, string> {
  const c = getContent();
  return {
    arch: r.arch.name,
    variant: r.variant.name,
    variantClause: c.variantClauses[r.variant.name] ?? "",
    loveClause: c.variantLoveClauses[r.variant.name] ?? "",
    rival: r.rival.name,
    rivalIcon: r.rival.icon,
    conflictQ: String(r.conflictQ),
    topDim: r.topDim,
  };
}

// 渲染免费预览板块
export function freeInsight(r: ReportVars): LockedSection {
  const c = getContent();
  const vars = buildVars(r);
  return {
    title: interpolate(c.freeInsight.title, vars),
    hook: "",
    stat: "",
    body: interpolate(c.freeInsight.body, vars),
  };
}

// 渲染锁定板块:将模板占位符替换为当前结果
export function lockedSections(r: ReportVars): LockedSection[] {
  const c = getContent();
  const vars = buildVars(r);
  return c.lockedSections.map((s) => ({
    title: interpolate(s.title, vars),
    hook: interpolate(s.hook, vars),
    stat: interpolate(s.stat, vars),
    body: interpolate(s.body, vars),
  }));
}
