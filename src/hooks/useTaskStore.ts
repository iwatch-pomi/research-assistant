"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExperimentTask, ProtocolTemplate } from "@/lib/types";
import { addDays, shiftDateTime } from "@/lib/date";
import {
  getTaskRepository,
  type NewTaskInput,
} from "@/services/taskRepository";

// アプリ全体で単一のリポジトリ実体を共有（差し替えはこのファクトリ内のみ）。
const repo = getTaskRepository();

/** プロトコルテンプレートを開始日基準で展開し、作成用入力の配列にする純粋関数。*/
export function expandProtocol(
  template: ProtocolTemplate,
  startDate: string
): NewTaskInput[] {
  return template.steps.map((step) => ({
    title: step.title,
    date: addDays(startDate, step.dayOffset),
    time: step.time,
    type: step.type,
    location: step.location,
    protocolId: template.id,
  }));
}

/**
 * リポジトリ層（データの保存・取得・更新）と React の状態を橋渡しするカスタムフック。
 *
 * コンポーネントはこのフック（および TaskContext）経由でのみデータを操作し、
 * 永続化の実体（インメモリ / 将来の Firebase）には依存しない。
 * 書き込み系はすべて Promise を返すので、将来そのまま API 通信へ置き換えられる。
 */
export function useTaskStore() {
  const [tasks, setTasks] = useState<ExperimentTask[]>([]);
  const [loading, setLoading] = useState(true);

  // 初期ロード／リアルタイム購読。subscribe があれば onSnapshot 相当で同期。
  useEffect(() => {
    let cancelled = false;

    if (repo.subscribe) {
      const unsubscribe = repo.subscribe((next) => {
        setTasks(next);
        setLoading(false);
      });
      return unsubscribe;
    }

    repo.list().then((next) => {
      if (!cancelled) {
        setTasks(next);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // subscribe 非対応の実装向けに、書き込み後へ最新を取り直すフォールバック。
  const refreshIfNeeded = useCallback(async () => {
    if (!repo.subscribe) {
      setTasks(await repo.list());
    }
  }, []);

  const addTask = useCallback(
    async (input: NewTaskInput) => {
      const created = await repo.create(input);
      await refreshIfNeeded();
      return created;
    },
    [refreshIfNeeded]
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<Omit<ExperimentTask, "id">>) => {
      const updated = await repo.update(id, patch);
      await refreshIfNeeded();
      return updated;
    },
    [refreshIfNeeded]
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      const current = tasks.find((t) => t.id === id);
      const updated = await repo.update(id, {
        isCompleted: !current?.isCompleted,
      });
      await refreshIfNeeded();
      return updated;
    },
    [tasks, refreshIfNeeded]
  );

  const importProtocol = useCallback(
    async (template: ProtocolTemplate, startDate: string) => {
      const created = await repo.createMany(expandProtocol(template, startDate));
      await refreshIfNeeded();
      return created;
    },
    [refreshIfNeeded]
  );

  // 「全体を N 時間一括シフト」: 未完了かつ時刻ありのタスクをまとめてずらす。
  const shiftAllIncomplete = useCallback(
    async (hours: number) => {
      const targets = tasks.filter((t) => !t.isCompleted && t.time);
      await Promise.all(
        targets.map((t) => {
          const { date, time } = shiftDateTime(t.date, t.time!, hours);
          return repo.update(t.id, { date, time });
        })
      );
      await refreshIfNeeded();
    },
    [tasks, refreshIfNeeded]
  );

  // 派生データ（純粋な絞り込み・並べ替え）はクライアント側で計算。
  const getTasksByDate = useCallback(
    (date: string) =>
      tasks
        .filter((t) => t.date === date)
        .sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99")),
    [tasks]
  );

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleComplete,
    importProtocol,
    shiftAllIncomplete,
    getTasksByDate,
  };
}

export type TaskStore = ReturnType<typeof useTaskStore>;
