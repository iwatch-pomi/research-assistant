"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DayCell from "./DayCell";
import { useTasks } from "@/context/TaskContext";
import { getConflictingTaskIds } from "@/lib/conflicts";
import {
  buildMonthGrid,
  formatMonthLabel,
  weekdayLabels,
  todayISO,
  fromISODate,
} from "@/lib/date";

interface CalendarMonthProps {
  onSelectDate: (iso: string) => void;
}

export default function CalendarMonth({ onSelectDate }: CalendarMonthProps) {
  const { getTasksByDate } = useTasks();
  const initial = fromISODate(todayISO());
  const [year, setYear] = useState(initial.getFullYear());
  const [month0, setMonth0] = useState(initial.getMonth());

  const grid = buildMonthGrid(year, month0);
  const weekdays = weekdayLabels();

  const prevMonth = () => {
    if (month0 === 0) {
      setYear((y) => y - 1);
      setMonth0(11);
    } else {
      setMonth0((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (month0 === 11) {
      setYear((y) => y + 1);
      setMonth0(0);
    } else {
      setMonth0((m) => m + 1);
    }
  };
  const goToday = () => {
    const t = fromISODate(todayISO());
    setYear(t.getFullYear());
    setMonth0(t.getMonth());
  };

  return (
    <div className="flex flex-col">
      {/* 月ナビ */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-bold text-slate-800">
          {formatMonthLabel(year, month0)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={goToday}
            className="mr-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 active:bg-slate-100"
          >
            今日
          </button>
          <button
            onClick={prevMonth}
            aria-label="前の月"
            className="rounded-full p-1.5 text-slate-500 active:bg-slate-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            aria-label="次の月"
            className="rounded-full p-1.5 text-slate-500 active:bg-slate-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 曜日見出し */}
      <div className="grid grid-cols-7 border-t border-slate-100 text-center text-[11px] font-medium">
        {weekdays.map((w, i) => (
          <div
            key={w}
            className={`py-1.5 ${
              i === 6 ? "text-red-400" : i === 5 ? "text-blue-400" : "text-slate-400"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 border-l border-t border-slate-100">
        {grid.map((cell) => (
          <DayCell
            key={cell.iso}
            cell={cell}
            tasks={getTasksByDate(cell.iso)}
            conflictIds={getConflictingTaskIds(
              getTasksByDate(cell.iso),
              cell.iso
            )}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
}
