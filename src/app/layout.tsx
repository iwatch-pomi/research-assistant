import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";

export const metadata: Metadata = {
  title: "LabFlow",
  description: "実験のスケジュール管理と記録を行うモバイルファーストアプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full bg-slate-100">
        <TaskProvider>
          {/* モバイルファースト: 中央に幅を絞ったコンテナ */}
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">
            {children}
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}
