"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useTaskStore, type TaskStore } from "@/hooks/useTaskStore";

/**
 * アプリ全体でタスクストアを共有するための薄い Context。
 * 実際のデータ操作ロジックは useTaskStore（→ リポジトリ層）に集約されており、
 * この Provider は単一インスタンスをツリーへ配るだけ。
 */
const TaskContext = createContext<TaskStore | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const store = useTaskStore();
  return <TaskContext.Provider value={store}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskStore {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
}
