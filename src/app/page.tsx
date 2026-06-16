"use client";

import { useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import CalendarMonth from "@/components/CalendarMonth";
import TaskRecordSheet from "@/components/TaskRecordSheet";
import RecordStep from "@/components/RecordStep";
import BottomNav from "@/components/BottomNav";
import { useTasks } from "@/context/TaskContext";

export default function HomePage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  return (
    <>
      <main className="flex-1 pb-4">
        <Dashboard onOpenTask={setSelectedTaskId} />

        {/* カレンダー */}
        <section className="mt-2 border-t-8 border-slate-100 pt-1">
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
        </section>
      </main>

      <BottomNav />

      <TaskRecordSheet
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
        onOpenTask={(id) => {
          setSelectedDate(null);
          setSelectedTaskId(id);
        }}
      />

      <RecordStep
        key={selectedTaskId}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />
    </>
  );
}
