"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExperimentTask, ProtocolTemplate } from "@/lib/types";
import { INITIAL_TASKS } from "@/lib/mockData";
import { addDays } from "@/lib/date";

interface TaskContextValue {
  tasks: ExperimentTask[];
  addTask: (task: Omit<ExperimentTask, "id" | "isCompleted">) => void;
  updateTask: (id: string, patch: Partial<ExperimentTask>) => void;
  toggleComplete: (id: string) => void;
  importProtocol: (template: ProtocolTemplate, startDate: string) => string[];
  getTasksByDate: (date: string) => ExperimentTask[];
}

const TaskContext = createContext<TaskContextValue | null>(null);

let idCounter = 0;
function genId(): string {
  idCounter += 1;
  return `task-${Date.now()}-${idCounter}`;
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<ExperimentTask[]>(INITIAL_TASKS);

  const addTask = useCallback(
    (task: Omit<ExperimentTask, "id" | "isCompleted">) => {
      setTasks((prev) => [
        ...prev,
        { ...task, id: genId(), isCompleted: false },
      ]);
    },
    []
  );

  const updateTask = useCallback((id: string, patch: Partial<ExperimentTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  }, []);

  // プロトコルテンプレートを startDate を起点に展開してカレンダーへ追加。
  const importProtocol = useCallback(
    (template: ProtocolTemplate, startDate: string): string[] => {
      const newTasks: ExperimentTask[] = template.steps.map((step) => ({
        id: genId(),
        title: step.title,
        date: addDays(startDate, step.dayOffset),
        time: step.time,
        type: step.type,
        isCompleted: false,
        protocolId: template.id,
      }));
      setTasks((prev) => [...prev, ...newTasks]);
      return newTasks.map((t) => t.id);
    },
    []
  );

  const getTasksByDate = useCallback(
    (date: string) =>
      tasks
        .filter((t) => t.date === date)
        .sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99")),
    [tasks]
  );

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      addTask,
      updateTask,
      toggleComplete,
      importProtocol,
      getTasksByDate,
    }),
    [tasks, addTask, updateTask, toggleComplete, importProtocol, getTasksByDate]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
}
