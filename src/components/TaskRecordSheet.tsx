"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Camera,
  Check,
  CircleDot,
  Clock,
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
}

export default function TaskRecordSheet({ date, onClose }: TaskRecordSheetProps) {
  const { getTasksByDate, toggleComplete, updateTask, addTask } = useTasks();

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
    <BottomSheet open={!!date} onClose={onClose} title={formatDateLabel(date)}>
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

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            conflict={conflictIds.has(task.id)}
            onToggle={() => toggleComplete(task.id)}
            onUpdate={(patch) => updateTask(task.id, patch)}
          />
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

/** タスク1件のカード。type に応じて記録フォームのメリハリをつける。 */
function TaskCard({
  task,
  conflict,
  onToggle,
  onUpdate,
}: {
  task: ExperimentTask;
  conflict: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<ExperimentTask>) => void;
}) {
  const [photoAdded, setPhotoAdded] = useState(false);
  const isIdle = task.type === "idle";

  return (
    <div
      className={`rounded-xl border p-3 ${
        conflict ? "border-red-300 bg-red-50/40" : "border-slate-200"
      }`}
    >
      {/* ヘッダ */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
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
            {task.time && (
              <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                <Clock size={11} />
                {task.time}
              </span>
            )}
          </div>
          <p
            className={`mt-1 text-sm font-medium ${
              task.isCompleted ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {task.title}
          </p>
        </div>
      </div>

      {/* 記録フォーム: 放置=超軽量チェック / 拘束=穴埋めフォーム */}
      {isIdle ? (
        <button
          onClick={onToggle}
          className={`mt-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            task.isCompleted
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-slate-200 text-slate-600 active:bg-slate-50"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
              task.isCompleted
                ? "border-green-500 bg-green-500 text-white"
                : "border-slate-300"
            }`}
          >
            {task.isCompleted && <Check size={14} />}
          </span>
          {task.isCompleted ? "確認済み" : "1タップで完了（例: 温度確認）"}
        </button>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-20 shrink-0 font-medium">OD600 値</span>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={task.odValue ?? ""}
              onChange={(e) =>
                onUpdate({
                  odValue:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              placeholder="例: 0.6"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
            />
          </label>
          <textarea
            value={task.notes ?? ""}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="メモ（試薬ロット、気づいたこと など）"
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhotoAdded(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 active:bg-slate-50"
            >
              <Camera size={14} />
              {photoAdded ? "写真を追加しました" : "写真を追加"}
            </button>
            <button
              onClick={onToggle}
              className={`ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                task.isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-600 text-white active:bg-blue-700"
              }`}
            >
              <Check size={14} />
              {task.isCompleted ? "完了済み" : "記録して完了"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
