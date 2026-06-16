"use client";

import { AlertTriangle } from "lucide-react";
import type { ExperimentTask } from "@/lib/types";
import type { CalendarCell } from "@/lib/date";

interface DayCellProps {
  cell: CalendarCell;
  tasks: ExperimentTask[];
  conflictIds: Set<string>;
  onSelect: (iso: string) => void;
}

const MAX_VISIBLE = 3;

export default function DayCell({
  cell,
  tasks,
  conflictIds,
  onSelect,
}: DayCellProps) {
  const hasConflict = tasks.some((t) => conflictIds.has(t.id));
  const visible = tasks.slice(0, MAX_VISIBLE);
  const overflow = tasks.length - visible.length;

  return (
    <button
      onClick={() => onSelect(cell.iso)}
      className={`relative flex min-h-[68px] flex-col gap-0.5 border-b border-r border-slate-100 p-1 text-left align-top ${
        cell.inMonth ? "bg-white" : "bg-slate-50/60"
      } ${hasConflict ? "ring-2 ring-inset ring-red-400" : ""}`}
    >
      {/* 日付 */}
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] font-semibold leading-none ${
            cell.isToday
              ? "flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"
              : cell.inMonth
                ? "text-slate-600"
                : "text-slate-300"
          }`}
        >
          {cell.day}
        </span>
        {hasConflict && (
          <AlertTriangle size={12} className="text-red-500" aria-label="拘束タスクの重複" />
        )}
      </div>

      {/* タスクチップ */}
      <div className="flex flex-col gap-0.5">
        {visible.map((t) => {
          const conflict = conflictIds.has(t.id);
          let cls: string;
          if (t.type === "idle") {
            // 放置: 薄い背景 + 点線枠
            cls =
              "border border-dashed border-slate-300 bg-slate-50 text-slate-500";
          } else if (conflict) {
            // 拘束 & 衝突: 赤
            cls = "bg-red-500 text-white";
          } else {
            // 拘束: 濃い背景
            cls = "bg-blue-600 text-white";
          }
          return (
            <span
              key={t.id}
              className={`truncate rounded px-1 py-[1px] text-[9px] leading-tight ${cls} ${
                t.isCompleted ? "line-through opacity-60" : ""
              }`}
            >
              {t.title}
            </span>
          );
        })}
        {overflow > 0 && (
          <span className="px-1 text-[9px] leading-tight text-slate-400">
            +{overflow}件
          </span>
        )}
      </div>
    </button>
  );
}
