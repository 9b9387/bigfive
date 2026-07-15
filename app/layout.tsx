import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const serif = Noto_Serif_SC({
  weight: ["600", "900"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "自然人格原型测试 · 你内心住着哪一种自然原型?",
  description: "基于大五人格模型 · IPIP 国际人格题库改编,2 分钟测出你的自然原型。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
