"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  MapPin,
  Plus,
} from "lucide-react";
import BottomSheet from "./BottomSheet";
import { useTasks } from "@/context/TaskContext";
import { getConflictingTaskIds } from "@/lib/conflicts";
import { formatDateLabel } from "@/lib/date";
import type { ExperimentTask } from "@/lib/types";

interface TaskRecordSheetProps {
  date: string | null;
  onClose: () => void;
  onOpenTask: (id: string) => void;
}

/** 日別のタスク一覧シート。タスクをタップすると全画面の RECORD STEP を開く。 */
export default function TaskRecordSheet({
  date,
  onClose,
  onOpenTask,
}: TaskRecordSheetProps) {
  const { getTasksByDate, addTask } = useTasks();

  // 追加フォーム用ローカル状態
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState<"idle" | "active">("active");

  if (!date) return null;

  const tasks = getTasksByDate(date);
  const conflictIds = getConflictingTaskIds(tasks, date);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      date,
      time: newTime || undefined,
      type: newType,
    });
    setNewTitle("");
    setNewTime("");
    setNewType("active");
    setShowAdd(false);
  };

  return (
    <BottomSheet
      open={!!date}
      onClose={onClose}
      title={`${formatDateLabel(date)} の詳細`}
    >
      {conflictIds.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          <AlertTriangle size={16} />
          拘束タスクが重複しています。手が離せない作業が重なっていないか確認してください。
        </div>
      )}

      {tasks.length === 0 && !showAdd && (
        <p className="py-6 text-center text-sm text-slate-400">
          この日のタスクはまだありません。
        </p>
      )}

      {/* 時刻軸タイムライン（タップで記録ステップへ） */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-stretch gap-2">
            <div className="flex w-12 shrink-0 flex-col items-center pt-2 text-[11px] font-medium text-slate-400">
              {task.time ?? "—"}
            </div>
            <div className="flex-1">
              <TaskRow
                task={task}
                conflict={conflictIds.has(task.id)}
                onOpen={() => onOpenTask(task.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* タスク追加 */}
      {showAdd ? (
        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="タスク名（例: PCR 反応液調製）"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400"
            />
            <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setNewType("active")}
                className={`px-3 py-1.5 ${
                  newType === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-500"
                }`}
              >
                拘束
              </button>
              <button
                onClick={() => setNewType("idle")}
                className={`px-3 py-1.5 ${
                  newType === "idle"
                    ? "bg-slate-500 text-white"
                    : "bg-white text-slate-500"
                }`}
              >
                放置
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white active:bg-blue-700"
            >
              追加
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 active:bg-slate-50"
        >
          <Plus size={16} />
          タスクを追加
        </button>
      )}
    </BottomSheet>
  );
}

/** タスク1件の行。タップで RECORD STEP を開く。 */
function TaskRow({
  task,
  conflict,
  onOpen,
}: {
  task: ExperimentTask;
  conflict: boolean;
  onOpen: () => void;
}) {
  const isIdle = task.type === "idle";

  return (
    <button
      onClick={onOpen}
      className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left ${
        conflict ? "border-red-300 bg-red-50/40" : "border-slate-200"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-[1px] text-[10px] font-semibold ${
              isIdle
                ? "border border-dashed border-slate-300 bg-slate-50 text-slate-500"
                : conflict
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white"
            }`}
          >
            <CircleDot size={10} />
            {isIdle ? "放置" : "拘束"}
          </span>
          {task.location && (
            <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
              <MapPin size={11} />
              {task.location}
            </span>
          )}
          {task.isCompleted && (
            <CheckCircle2 size={14} className="text-green-500" />
          )}
          {task.odValue != null && (
            <span className="text-[11px] text-slate-400">
              OD {task.odValue}
            </span>
          )}
        </div>
        <p
          className={`mt-1 truncate text-sm font-medium ${
            task.isCompleted ? "text-slate-400 line-through" : "text-slate-800"
          }`}
        >
          {task.title}
        </p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-slate-300" />
    </button>
  );
}
