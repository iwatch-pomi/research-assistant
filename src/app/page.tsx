"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import TaskRecordSheet from "@/components/TaskRecordSheet";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <>
      {/* ヘッダ */}
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <FlaskConical size={22} className="text-blue-600" />
        <h1 className="text-lg font-bold tracking-tight text-slate-800">
          LabFlow
        </h1>
        <span className="ml-auto text-xs text-slate-400">実験スケジュール</span>
      </header>

      <main className="flex-1 pb-4">
        <CalendarMonth onSelectDate={setSelectedDate} />

        {/* 凡例 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 px-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded bg-blue-600" />
            拘束（手が離せない）
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded border border-dashed border-slate-300 bg-slate-50" />
            放置（培養・待機）
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded bg-red-500" />
            拘束の重複 ⚠️
          </span>
        </div>
      </main>

      <BottomNav />

      <TaskRecordSheet
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </>
  );
}
