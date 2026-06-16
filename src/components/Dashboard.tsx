"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  FlaskConical,
  MapPin,
  Settings,
} from "lucide-react";
import Countdown from "./Countdown";
import { useTasks } from "@/context/TaskContext";
import { getNextActiveTask } from "@/lib/schedule";
import { todayISO, toDateTime } from "@/lib/date";
import type { ExperimentTask } from "@/lib/types";

export default function Dashboard({
  onOpenTask,
}: {
  onOpenTask: (id: string) => void;
}) {
  const { tasks, shiftAllIncomplete } = useTasks();
  const [open, setOpen] = useState(true);
  const [shifting, setShifting] = useState(false);

  const today = todayISO();
  const todayTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.date === today)
        .sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99")),
    [tasks, today]
  );
  const next = useMemo(() => getNextActiveTask(tasks), [tasks]);

  const handleShift = async () => {
    setShifting(true);
    await shiftAllIncomplete(3);
    setShifting(false);
  };

  return (
    <div className="flex flex-col">
      {/* ヘッダ */}
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <FlaskConical size={20} className="text-blue-600" />
        <div className="leading-tight">
          <h1 className="text-base font-bold tracking-tight text-slate-800">
            LAB DASHBOARD
          </h1>
          <p className="text-[11px] text-slate-400">User: T. Suzuki</p>
        </div>
        <button
          aria-label="設定"
          className="ml-auto rounded-full p-1.5 text-slate-400 active:bg-slate-100"
        >
          <Settings size={18} />
        </button>
      </header>

      <div className="px-4 py-4">
        {/* 次タスクのカウントダウン */}
        <div className="rounded-2xl bg-blue-50 p-4">
          {next ? (
            <>
              <p className="flex items-center gap-1 text-xs font-medium text-blue-700">
                <Clock size={13} />
                次：{next.title}
                {next.location && (
                  <span className="text-blue-400">／{next.location}</span>
                )}
              </p>
              <Countdown
                target={toDateTime(next.date, next.time)}
                className="mt-1 block font-mono text-4xl font-bold tracking-wider text-blue-700 tabular-nums"
              />
            </>
          ) : (
            <p className="py-2 text-center text-sm text-blue-700">
              予定されている拘束タスクはありません 🎉
            </p>
          )}
        </div>

        {/* TODAY'S EXPERIMENTS */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-5 flex w-full items-center justify-between"
        >
          <span className="text-xs font-bold tracking-widest text-slate-500">
            TODAY&apos;S EXPERIMENTS
          </span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${
              open ? "" : "-rotate-90"
            }`}
          />
        </button>

        {open && (
          <div className="mt-3">
            {todayTasks.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                今日の実験はありません。
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {todayTasks.map((t) => (
                  <TimelineRow
                    key={t.id}
                    task={t}
                    isNext={next?.id === t.id}
                    onClick={() => onOpenTask(t.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 全体を3時間一括シフト */}
        <button
          onClick={handleShift}
          disabled={shifting}
          className="mt-5 w-full rounded-xl bg-blue-100 py-3 text-sm font-semibold text-blue-700 active:bg-blue-200 disabled:opacity-60"
        >
          {shifting ? "シフト中…" : "全体を3時間一括シフト"}
        </button>
      </div>
    </div>
  );
}

function TimelineRow({
  task,
  isNext,
  onClick,
}: {
  task: ExperimentTask;
  isNext: boolean;
  onClick: () => void;
}) {
  const isIdle = task.type === "idle";
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex w-full items-stretch gap-2 rounded-xl border p-2.5 text-left ${
          isNext
            ? "border-blue-300 bg-blue-50"
            : isIdle
              ? "border-dashed border-slate-300 bg-slate-50"
              : "border-slate-200 bg-white"
        }`}
      >
        {/* 時刻ガター */}
        <div className="flex w-12 shrink-0 flex-col items-center justify-center border-r border-slate-200 pr-2 text-[11px] text-slate-400">
          {task.time ?? "—"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded px-1.5 py-[1px] text-[10px] font-semibold ${
                isIdle
                  ? "border border-dashed border-slate-300 bg-white text-slate-500"
                  : "bg-blue-600 text-white"
              }`}
            >
              {isIdle ? "放置" : "拘束"}
            </span>
            {task.location && (
              <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                <MapPin size={11} />
                {task.location}
              </span>
            )}
            {task.isCompleted && (
              <CheckCircle2 size={14} className="ml-auto text-green-500" />
            )}
          </div>
          <p
            className={`mt-0.5 truncate text-sm font-medium ${
              task.isCompleted ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {task.title}
          </p>
        </div>
      </button>
    </li>
  );
}
