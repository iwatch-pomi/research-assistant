"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, FileText, Plus, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTasks } from "@/context/TaskContext";
import { SHARED_PROTOCOLS } from "@/lib/mockProtocols";
import { todayISO, formatDateLabel } from "@/lib/date";
import type { ProtocolTemplate } from "@/lib/types";

export default function ProtocolsPage() {
  const { importProtocol } = useTasks();
  const router = useRouter();
  const [startDate, setStartDate] = useState(todayISO());
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = async (template: ProtocolTemplate) => {
    await importProtocol(template, startDate);
    setAdded(template.name);
    setTimeout(() => router.push("/"), 1100);
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <FileText size={20} className="text-blue-600" />
        <h1 className="text-base font-bold tracking-tight text-slate-800">
          プロトコル（テンプレート）
        </h1>
      </header>

      <main className="flex-1 space-y-4 px-4 py-4 pb-6">
        <p className="text-sm text-slate-500">
          定番の実験プロトコルをテンプレートとして保存。開始日を選んでカレンダーへ
          展開すると、放置・拘束が自動で仕分けされます。
        </p>

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
              <h2 className="text-sm font-bold text-slate-800">{p.name}</h2>
              <p className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-0.5">
                  <User size={11} />
                  {p.author}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock size={11} />
                  {p.durationDays}日間 / {p.steps.length}ステップ
                </span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {p.description}
              </p>
            </div>

            <ul className="space-y-1 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
              {p.steps.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span
                    className={`inline-flex w-9 shrink-0 justify-center rounded px-1 py-[1px] text-[10px] font-semibold ${
                      s.type === "active"
                        ? "bg-blue-600 text-white"
                        : "border border-dashed border-slate-300 bg-white text-slate-500"
                    }`}
                  >
                    {s.type === "active" ? "拘束" : "放置"}
                  </span>
                  <span className="text-slate-400">Day {s.dayOffset + 1}</span>
                  <span className="truncate text-slate-600">{s.title}</span>
                </li>
              ))}
            </ul>

            <div className="p-3">
              <button
                onClick={() => handleAdd(p)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white active:bg-blue-700"
              >
                <Plus size={16} />
                カレンダーに展開
              </button>
            </div>
          </article>
        ))}
      </main>

      <BottomNav />

      {added && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
            <CheckCircle2 size={36} className="text-green-500" />
            <p className="text-sm font-semibold text-slate-800">
              「{added}」を展開しました
            </p>
            <p className="text-xs text-slate-400">
              {formatDateLabel(startDate)} から追加しました
            </p>
          </div>
        </div>
      )}
    </>
  );
}
