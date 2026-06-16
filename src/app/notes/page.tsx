"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MapPin, NotebookPen } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import RecordStep from "@/components/RecordStep";
import { useTasks } from "@/context/TaskContext";
import { formatDateLabel } from "@/lib/date";
import type { ExperimentTask } from "@/lib/types";

export default function NotesPage() {
  const { tasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  // 記録のあるタスク（完了 or OD値 or メモ）を日付ごとにまとめ、新しい順に表示。
  const groups = useMemo(() => {
    const recorded = tasks.filter(
      (t) => t.isCompleted || t.odValue != null || (t.notes && t.notes.trim())
    );
    const byDate = new Map<string, ExperimentTask[]>();
    for (const t of recorded) {
      const list = byDate.get(t.date) ?? [];
      list.push(t);
      byDate.set(t.date, list);
    }
    return [...byDate.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) =>
          (a.time ?? "99:99").localeCompare(b.time ?? "99:99")
        ),
      }));
  }, [tasks]);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <NotebookPen size={20} className="text-blue-600" />
        <h1 className="text-base font-bold tracking-tight text-slate-800">
          実験ノート（記録）
        </h1>
      </header>

      <main className="flex-1 space-y-5 px-4 py-4 pb-6">
        {groups.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            まだ記録がありません。カレンダーのタスクから記録しましょう。
          </p>
        ) : (
          groups.map(({ date, items }) => (
            <section key={date}>
              <h2 className="mb-2 text-xs font-bold tracking-wide text-slate-500">
                {formatDateLabel(date)}
              </h2>
              <ul className="space-y-2">
                {items.map((t) => (
                  <li key={t.id}>
                   <button
                    onClick={() => setSelectedTaskId(t.id)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-left active:bg-slate-50"
                   >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">
                        {t.time ?? "—"}
                      </span>
                      <span
                        className={`rounded px-1.5 py-[1px] text-[10px] font-semibold ${
                          t.type === "active"
                            ? "bg-blue-600 text-white"
                            : "border border-dashed border-slate-300 bg-white text-slate-500"
                        }`}
                      >
                        {t.type === "active" ? "拘束" : "放置"}
                      </span>
                      {t.location && (
                        <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                          <MapPin size={11} />
                          {t.location}
                        </span>
                      )}
                      {t.isCompleted && (
                        <CheckCircle2
                          size={14}
                          className="ml-auto text-green-500"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {t.title}
                    </p>
                    {(t.odValue != null || t.notes) && (
                      <div className="mt-1.5 space-y-0.5 border-t border-slate-100 pt-1.5 text-xs text-slate-600">
                        {t.odValue != null && (
                          <p>
                            <span className="text-slate-400">OD600：</span>
                            {t.odValue}
                          </p>
                        )}
                        {t.notes && (
                          <p>
                            <span className="text-slate-400">メモ：</span>
                            {t.notes}
                          </p>
                        )}
                      </div>
                    )}
                   </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <BottomNav />

      <RecordStep
        key={selectedTaskId}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />
    </>
  );
}
