"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  Link2,
  QrCode,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import DummyQR from "@/components/DummyQR";
import { useTasks } from "@/context/TaskContext";
import { SHARED_PROTOCOLS } from "@/lib/mockProtocols";
import { todayISO, formatDateLabel } from "@/lib/date";
import type { ProtocolTemplate } from "@/lib/types";

export default function SharePage() {
  const { importProtocol } = useTasks();
  const router = useRouter();
  const [startDate, setStartDate] = useState(todayISO());
  const [imported, setImported] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const handleImport = async (template: ProtocolTemplate) => {
    await importProtocol(template, startDate);
    setImported(template.name);
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <QrCode size={20} className="text-blue-600" />
        <h1 className="text-base font-bold tracking-tight text-slate-800">
          PROTOCOL SHARE
        </h1>
      </header>

      <main className="flex-1 space-y-5 px-4 py-4 pb-6">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
          <span className="font-medium text-slate-600">展開する開始日</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
          />
        </label>

        {SHARED_PROTOCOLS.map((p) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-2xl border border-slate-200"
          >
            <div className="p-4">
              <p className="text-[11px] text-slate-400">From: {p.author}</p>
              <h2 className="mt-0.5 text-lg font-bold leading-snug text-slate-800">
                {p.name}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
                <span>作成者: {p.author}</span>
                {p.verified && (
                  <span className="inline-flex items-center gap-0.5 text-green-600">
                    <BadgeCheck size={12} />
                    検証済み
                  </span>
                )}
                {p.version && <span>バージョン: {p.version}</span>}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {p.description}
              </p>
            </div>

            {/* QR: The Key */}
            <div className="px-4">
              <div className="flex flex-col items-center rounded-xl border-2 border-green-400 bg-green-50/40 p-4">
                <span className="mb-2 text-[11px] font-semibold tracking-widest text-green-600">
                  THE KEY
                </span>
                <DummyQR seed={p.id} size={160} />
              </div>
            </div>

            <div className="space-y-2 p-4">
              <button
                onClick={() => handleImport(p)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white active:bg-green-600"
              >
                <Download size={16} />
                ラボにインポート
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => flash("共有リンクをコピーしました（モック）")}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 active:bg-slate-50"
                >
                  さらにシェア
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => flash("リンクをコピーしました（モック）")}
                  aria-label="リンクを共有"
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 active:bg-slate-50"
                >
                  <Link2 size={16} />
                </button>
                <button
                  onClick={() => flash("QRを表示しました（モック）")}
                  aria-label="QRを共有"
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 active:bg-slate-50"
                >
                  <QrCode size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>

      <BottomNav />

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="rounded-full bg-slate-800/90 px-4 py-2 text-xs font-medium text-white">
            {toast}
          </span>
        </div>
      )}

      {imported && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
            <CheckCircle2 size={36} className="text-green-500" />
            <p className="text-sm font-semibold text-slate-800">
              「{imported}」を展開しました
            </p>
            <p className="text-xs text-slate-400">
              {formatDateLabel(startDate)} からカレンダーに追加しました
            </p>
          </div>
        </div>
      )}
    </>
  );
}
