"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  GitBranch,
  Mic,
  MapPin,
} from "lucide-react";
import ToggleSwitch from "./ui/ToggleSwitch";
import NumericKeypad from "./NumericKeypad";
import { useTasks } from "@/context/TaskContext";
import { SHARED_PROTOCOLS } from "@/lib/mockProtocols";
import { formatDateLabel } from "@/lib/date";
import type { ExperimentTask } from "@/lib/types";

/** 1タスク専用の全画面記録ビュー（RECORD STEP）。*/
export default function RecordStep({
  task,
  onClose,
}: {
  task: ExperimentTask | null;
  onClose: () => void;
}) {
  const { updateTask, toggleComplete } = useTasks();

  // 拘束タスクの記録用ローカル状態
  const [od, setOd] = useState<string>(
    task?.odValue != null ? String(task.odValue) : ""
  );
  const [prepDone, setPrepDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!task) return null;

  const isIdle = task.type === "idle";
  const experimentName =
    SHARED_PROTOCOLS.find((p) => p.id === task.protocolId)?.name ?? "実験記録";

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const handleOd = (next: string) => {
    setOd(next);
    updateTask(task.id, { odValue: next === "" ? undefined : Number(next) });
  };

  const handleComplete = async () => {
    if (!task.isCompleted) await toggleComplete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col bg-white">
      {/* ヘッダ */}
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <button
          onClick={onClose}
          aria-label="戻る"
          className="rounded-full p-1 text-slate-500 active:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1 text-center leading-tight">
          <h1 className="text-sm font-bold tracking-wide text-slate-800">
            RECORD STEP
          </h1>
          <p className="truncate text-[11px] text-slate-400">
            Experiment: {experimentName}
          </p>
        </div>
        <button
          onClick={handleComplete}
          aria-label="記録して完了"
          className={`rounded-full p-1.5 ${
            task.isCompleted
              ? "text-green-500"
              : "text-blue-600 active:bg-blue-50"
          }`}
        >
          <Check size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Step 見出し */}
        <div className="mb-4">
          <p className="text-[11px] font-medium text-slate-400">
            Step: {task.title}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`rounded px-1.5 py-[1px] text-[10px] font-semibold ${
                isIdle
                  ? "border border-dashed border-slate-300 bg-slate-50 text-slate-500"
                  : "bg-blue-600 text-white"
              }`}
            >
              {isIdle ? "放置" : "拘束"}
            </span>
            {task.time && (
              <span className="text-xs text-slate-400">{task.time}</span>
            )}
            {task.location && (
              <span className="flex items-center gap-0.5 text-xs text-slate-400">
                <MapPin size={12} />
                {task.location}
              </span>
            )}
            <span className="ml-auto text-[11px] text-slate-400">
              {formatDateLabel(task.date)}
            </span>
          </div>
        </div>

        {isIdle ? (
          /* 放置: 大きなトグルで完了 */
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">
              この放置ステップは完了しましたか？
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-base font-semibold ${
                  task.isCompleted ? "text-green-600" : "text-slate-400"
                }`}
              >
                {task.isCompleted ? "確認済み" : "未完了"}
              </span>
              <ToggleSwitch
                checked={task.isCompleted}
                onChange={() => toggleComplete(task.id)}
                ariaLabel="完了を切り替え"
              />
            </div>
          </div>
        ) : (
          <>
            {/* 事前チェック（ephemeral） */}
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] text-slate-400">直前チェック</p>
                  <p className="text-sm font-medium text-slate-700">
                    氷とチューブを準備しましたか？
                  </p>
                </div>
                <ToggleSwitch
                  checked={prepDone}
                  onChange={setPrepDone}
                  ariaLabel="準備を確認"
                />
              </div>
              <p className="mt-1 text-[11px] text-green-600">
                {prepDone ? "準備しました" : "未確認"}
              </p>
            </div>

            {/* OD600 入力 */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700">
                OD<sub>600</sub> 値を入力
              </p>
              <div className="my-3 rounded-2xl border border-slate-200 py-5 text-center">
                <span className="font-mono text-4xl font-bold tracking-wider text-slate-800 tabular-nums">
                  [ {od === "" ? "0.0" : od} ]
                </span>
              </div>
              <NumericKeypad value={od} onChange={handleOd} />
            </div>

            {/* 補助操作（ダミー） */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => flash("音声入力（モック）")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 active:bg-slate-50"
              >
                <Mic size={16} />
                音声入力
              </button>
              <button
                onClick={() => flash("写真を追加しました（モック）")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 active:bg-slate-50"
              >
                <Camera size={16} />
                写真操作
              </button>
            </div>

            {/* メモ */}
            <textarea
              value={task.notes ?? ""}
              onChange={(e) => updateTask(task.id, { notes: e.target.value })}
              placeholder="メモ（試薬ロット、気づいたこと など）"
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />

            {/* 分岐・リカバリー（ダミー） */}
            <p className="mt-4 text-center text-[11px] text-slate-400">
              想定と変わらない場合も、分岐でオプションを選べます
            </p>
            <button
              onClick={() => flash("分岐・リカバリー（モック）")}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-100 py-3 text-sm font-semibold text-blue-700 active:bg-blue-200"
            >
              <GitBranch size={16} />
              分岐・リカバリー
            </button>
          </>
        )}
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center">
          <span className="rounded-full bg-slate-800/90 px-4 py-2 text-xs font-medium text-white">
            {toast}
          </span>
        </div>
      )}
    </div>
  );
}
