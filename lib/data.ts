/* ================================================================
   自然人格原型测试 — 内容与体系定义
   测量层: IPIP 大五人格结构改编 · 20 题判断式短量表(每维 4 题,含反向计分)
   术语层: 独创「自然原型」体系 —— 五维大白话命名 + 16 原型 × 2 型态
   ================================================================ */

export type DimKey = "explore" | "action" | "empathy" | "order" | "calm";

// 五维(大白话命名,注释为对应的大五人格维度)
// explore 探索欲 (Openness)      action 行动力 (Extraversion)
// empathy 共情力 (Agreeableness) order  秩序感 (Conscientiousness)
// calm    定力   (Emotional Stability / 反向 Neuroticism)
export const DIMS: DimKey[] = ["explore", "action", "empathy", "order", "calm"];

export const DIM_NAMES: Record<DimKey, string> = {
  explore: "探索欲",
  action: "行动力",
  empathy: "共情力",
  order: "秩序感",
  calm: "定力",
};

export interface Question {
  t: string;
  dim: DimKey;
  rev?: boolean; // 反向计分
}

// 20 题判断式短量表(IPIP 条目改编)
// 作答: 是=2 / 不确定=1 / 否=0,反向题翻转。每维总分 0~8。
export const QUESTIONS: Question[] = [
  // 探索欲 (O)
  { t: "我经常冒出一些别人觉得「想太多」的念头。", dim: "explore" },
  { t: "比起尝试新路线,我更愿意走熟悉的那一条。", dim: "explore", rev: true },
  { t: "关于人生、宇宙这类抽象话题的讨论,会让我兴奋。", dim: "explore" },
  { t: "老实说,我对艺术和美的东西没什么感觉。", dim: "explore", rev: true },
  // 行动力 (E)
  { t: "在人多的场合,我很快就能热起来。", dim: "action" },
  { t: "需要有人发言时,我总是等别人先开口。", dim: "action", rev: true },
  { t: "我常常是朋友圈里发起活动的那个人。", dim: "action" },
  { t: "社交一整天之后,我需要独处很久才能恢复。", dim: "action", rev: true },
  // 共情力 (A)
  { t: "别人情绪低落时,我几乎能立刻察觉到。", dim: "empathy" },
  { t: "对别人的麻烦事,我其实不太感兴趣。", dim: "empathy", rev: true },
  { t: "朋友们经常主动找我倾诉心事。", dim: "empathy" },
  { t: "争论时,赢下来比照顾对方的感受更重要。", dim: "empathy", rev: true },
  // 秩序感 (C)
  { t: "我的物品和文件都有固定的存放位置。", dim: "order" },
  { t: "我经常把事情拖到最后一刻才动手。", dim: "order", rev: true },
  { t: "开始做一件事之前,我习惯先列个计划。", dim: "order" },
  { t: "我常常忘记把东西放回原处。", dim: "order", rev: true },
  // 定力 (ES)
  { t: "大部分时间里,我的情绪都是平稳的。", dim: "calm" },
  { t: "一点小事就能让我烦躁很久。", dim: "calm", rev: true },
  { t: "压力再大,我基本也能睡得着觉。", dim: "calm" },
  { t: "我经常为还没发生的事情担心。", dim: "calm", rev: true },
];

export interface Archetype {
  icon: string;
  name: string;
  tagline: string;
}

// 16 自然原型: 探索欲/行动力/共情力/秩序感 四维高低组合
// key 为 4 位二进制字符串,依次是 探索欲·行动力·共情力·秩序感 (1=高 0=低)
export const ARCHETYPES: Record<string, Archetype> = {
  "1111": { icon: "🗼", name: "灯塔领航者", tagline: "照亮方向,也照顾同行的人" },
  "1110": { icon: "🔥", name: "破晓行动家", tagline: "天没亮就出发的那种人" },
  "1101": { icon: "⛰️", name: "山巅开拓者", tagline: "认准高处,一步步凿路上去" },
  "1100": { icon: "🌬️", name: "疾风游侠", tagline: "自由是唯一不肯让步的东西" },
  "1011": { icon: "🌿", name: "幽谷园丁", tagline: "安静地让身边的一切慢慢变好" },
  "1010": { icon: "🌙", name: "银月诗人", tagline: "在别人看不见的地方感受世界" },
  "1001": { icon: "🌌", name: "静湖观察者", tagline: "不动声色,却看得最深" },
  "1000": { icon: "✨", name: "星野漫游者", tagline: "灵魂常驻远方,肉身偶尔在场" },
  "0111": { icon: "🕯️", name: "炉火守护者", tagline: "有你在的地方,就有秩序和暖意" },
  "0110": { icon: "🌊", name: "暖流连接者", tagline: "人和人之间的桥,多半是你搭的" },
  "0101": { icon: "🧱", name: "山脊建造者", tagline: "别人画蓝图,你把它变成真的" },
  "0100": { icon: "⚡", name: "惊雷冲锋者", tagline: "想到就做,从不拖泥带水" },
  "0011": { icon: "🌳", name: "老树守望者", tagline: "可靠得让人忘了说谢谢" },
  "0010": { icon: "🐚", name: "深海共感者", tagline: "沉默,但比谁都懂人心" },
  "0001": { icon: "🪨", name: "磐石工匠", tagline: "把一件事做到极致的沉静力量" },
  "0000": { icon: "🐺", name: "平原独行者", tagline: "不合群不是缺点,是选择" },
};

export interface Variant {
  name: string;
  desc: string;
}

// 型态变体(第五维「定力」): 高=静水,低=浪潮
export const VARIANTS: Record<"still" | "tide", Variant> = {
  still: { name: "静水型", desc: "情绪如深潭,风浪过境也波澜不惊" },
  tide: { name: "浪潮型", desc: "感受强烈而真实,能量随情绪涨落" },
};

export const BARNUM =
  "你习惯把最汹涌的部分藏在平静之下。别人以为已经足够了解你,但他们看到的,只是你允许他们看到的那一层。";

export interface LockedSection {
  icon: string;
  title: string;
  body: string;
}

export function lockedSections(arch: Archetype, variant: Variant, rival: Archetype): LockedSection[] {
  return [
    {
      icon: "⚠️",
      title: "你隐藏的致命弱点",
      body: `${arch.name}·${variant.name}最大的软肋,是在最需要开口求助的时刻选择沉默。你把「不麻烦别人」当成骄傲,却让它在关键节点反噬——${
        variant.name === "浪潮型"
          ? "尤其当情绪处于低谷时,你会把求助误判为示弱"
          : "尤其当一切看似平稳时,你会低估问题积累的速度"
      }。过去两年里,至少有一次重要机会因此从你指缝溜走。`,
    },
    {
      icon: "🧭",
      title: "最适合你的职业方向",
      body: `你的五维组合指向一种稀缺的职业形态:需要独立判断、又能在关键时刻影响他人的角色。战略、创作、深度专业类的路径会让你的天赋以 3 倍效率兑现,而纯执行、高频社交类的岗位会持续消耗你。未来 18 个月,你会遇到一次与此相关的转向窗口。`,
    },
    {
      icon: "⚔️",
      title: "你和哪种原型天生相克",
      body: `与你相克的是「${rival.name}」${rival.icon}——四个维度上与你完全相反的人。这种人会精准踩中你的雷区:他们用你最不屑的方式,得到你最想要的东西。辨认方法很简单:初次见面 10 分钟内,你会莫名感到一种「被冒犯却说不出为什么」的烦躁。远离,或者读懂之后反向利用。`,
    },
  ];
}

export const TOAST_POOL: [string, string][] = [
  ["北京", "L"], ["上海", "W"], ["深圳", "Z"], ["杭州", "C"], ["成都", "T"],
  ["广州", "H"], ["南京", "S"], ["武汉", "Y"], ["西安", "M"], ["重庆", "J"],
];

// 答题中途的好奇心钩子(key 为题目下标)
export const TEASES: Record<number, string> = {
  8: "有点意思——你前 8 题的作答模式,在样本库中出现率仅 4.6%。",
  15: "你的「定力」曲线出现了少见的波动。最后 5 题,决定你的型态。",
};

export const ANA_STEPS = [
  "正在校验 20 组作答的一致性…",
  "正在计算五维得分与常模百分位…",
  "正在比对 1,204,833 份样本…",
  "检测到少见的维度组合,启用深度模型…",
  "正在匹配 32 种自然原型…",
];
