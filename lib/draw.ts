import { TestResult } from "./scoring";

// 分享海报(Canvas 绘制,含假二维码占位)
// 视觉与站内一致:纸灰底 · 墨绿油墨 · 等高线 · 衬线大字
const INK = "#20302a";
const PINE = "#2f5d4a";
const AMBER = "#a87b24";
const PAPER = "#f6f7f4";
const SERIF = '"Noto Serif SC","Songti SC","SimSun",serif';

function contour(c: CanvasRenderingContext2D, cx: number, cy: number, radii: number[], color: string) {
  c.save();
  c.strokeStyle = color;
  c.lineWidth = 1.2;
  radii.forEach((r, i) => {
    c.globalAlpha = 0.18 + i * 0.12;
    c.beginPath();
    // 略微不规则的同心环,模拟等高线
    for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.12) {
      const wobble = 1 + 0.06 * Math.sin(a * 3 + i * 1.7) + 0.04 * Math.cos(a * 5 + i);
      const x = cx + Math.cos(a) * r * wobble;
      const y = cy + Math.sin(a) * r * wobble;
      if (a === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
  });
  c.restore();
}

export function drawShareCard(cv: HTMLCanvasElement, R: TestResult) {
  const c = cv.getContext("2d");
  if (!c) return;
  const W = 640, H = 880;
  c.fillStyle = PAPER;
  c.fillRect(0, 0, W, H);
  // 边框:双线画框,像标本卡
  c.strokeStyle = INK;
  c.lineWidth = 2;
  c.strokeRect(24, 24, W - 48, H - 48);
  c.lineWidth = 0.8;
  c.strokeRect(34, 34, W - 68, H - 68);
  // 等高线背景
  contour(c, W - 120, 150, [40, 70, 100, 135], PINE);
  contour(c, 110, H - 200, [30, 55, 82], PINE);

  c.textAlign = "center";
  c.fillStyle = "#5f6f66";
  c.font = "600 19px sans-serif";
  c.fillText("自 然 人 格 原 型 测 绘", W / 2, 92);

  // 原型徽记:等高线环 + 图腾
  contour(c, W / 2, 240, [52, 78, 104], PINE);
  c.font = "84px serif";
  c.fillText(R.arch.icon, W / 2, 272);

  c.fillStyle = "#5f6f66";
  c.font = "600 15px sans-serif";
  c.fillText(`原型档案 NO. ${R.key}-${R.variant.name === "静水型" ? "S" : "T"}`, W / 2, 396);
  c.fillStyle = INK;
  c.font = `900 62px ${SERIF}`;
  c.fillText(R.arch.name, W / 2, 465);
  c.fillStyle = AMBER;
  c.font = "700 26px sans-serif";
  c.fillText(`${R.variant.name} · 人群稀有度仅 ${R.rarity}%`, W / 2, 512);

  c.fillStyle = "#5f6f66";
  c.font = "23px sans-serif";
  c.fillText("我测出了内心的自然原型", W / 2, 578);
  c.fillText("你是哪一种?", W / 2, 612);

  // 假二维码
  const qx = W / 2 - 70, qy = 656, cell = 10;
  c.fillStyle = "#fff";
  c.fillRect(qx - 12, qy - 12, 164, 164);
  c.strokeStyle = INK;
  c.lineWidth = 1;
  c.strokeRect(qx - 12, qy - 12, 164, 164);
  c.fillStyle = INK;
  for (let r = 0; r < 14; r++)
    for (let col = 0; col < 14; col++)
      if ((r * 31 + col * 17 + r * col) % 5 < 2) c.fillRect(qx + col * cell, qy + r * cell, cell - 1, cell - 1);
  ([[0, 0], [0, 10], [10, 0]] as const).forEach(([r, col]) => {
    c.fillStyle = INK;
    c.fillRect(qx + col * cell, qy + r * cell, 40, 40);
    c.fillStyle = "#fff";
    c.fillRect(qx + col * cell + 10, qy + r * cell + 10, 20, 20);
    c.fillStyle = INK;
    c.fillRect(qx + col * cell + 15, qy + r * cell + 15, 10, 10);
  });
  c.fillStyle = "#5f6f66";
  c.font = "18px sans-serif";
  c.fillText("长按识别 · 2 分钟测出你的原型", W / 2, 852);
}

// 收银台假二维码
export function drawFakeQr(cv: HTMLCanvasElement, seed: number) {
  const c = cv.getContext("2d");
  if (!c) return;
  c.fillStyle = "#fff";
  c.fillRect(0, 0, 200, 200);
  c.fillStyle = "#111";
  const n = 21, cell = 200 / n;
  for (let r = 0; r < n; r++)
    for (let col = 0; col < n; col++)
      if ((r * 31 + col * 17 + Math.floor(seed * 13) * (r + col)) % 5 < 2)
        c.fillRect(col * cell, r * cell, cell - 0.8, cell - 0.8);
  ([[0, 0], [0, n - 7], [n - 7, 0]] as const).forEach(([r, col]) => {
    c.fillStyle = "#111";
    c.fillRect(col * cell, r * cell, cell * 7, cell * 7);
    c.fillStyle = "#fff";
    c.fillRect((col + 1) * cell, (r + 1) * cell, cell * 5, cell * 5);
    c.fillStyle = "#111";
    c.fillRect((col + 2) * cell, (r + 2) * cell, cell * 3, cell * 3);
  });
}
