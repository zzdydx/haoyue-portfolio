import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:3000${basePath}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "王皓月｜交互作品集",
  description: "王皓月的交互设计、UI/UX、品牌、插画、动效与 3D 作品集。",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
  openGraph: {
    title: "王皓月｜交互作品集",
    description: "UI/UX · 品牌 · 插画 · 动效 · 3D",
    type: "website",
    images: [{ url: `${basePath}/og.png`, width: 1760, height: 920 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "王皓月｜交互作品集",
    description: "UI/UX · 品牌 · 插画 · 动效 · 3D",
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
