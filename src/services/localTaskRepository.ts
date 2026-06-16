import type { ExperimentTask } from "@/lib/types";
import { INITIAL_TASKS } from "@/lib/mockData";
import type { NewTaskInput, TaskRepository } from "./taskRepository";

/**
 * インメモリのタスクリポジトリ（MVP 用）。
 *
 * 単一のストア＋オブザーバ（subscribe）構成にすることで、Firestore の
 * onSnapshot と同じ「変更が購読者へ自動配信される」挙動を再現している。
 * 将来 firebaseTaskRepository へ差し替えても、利用側（useTaskStore）の
 * コードは変更不要。
 *
 * 注意: 永続化しないため、リロードで INITIAL_TASKS の初期状態に戻る。
 */

let store: ExperimentTask[] = [...INITIAL_TASKS];
const listeners = new Set<(tasks: ExperimentTask[]) => void>();

let idCounter = 0;
function genId(): string {
  idCounter += 1;
  return `task-${Date.now()}-${idCounter}`;
}

/** 変更を全購読者へ通知（毎回イミュータブルなスナップショットを渡す） */
function emit(): void {
  const snapshot = [...store];
  for (const listener of listeners) listener(snapshot);
}

function buildTask(input: NewTaskInput): ExperimentTask {
  return {
    id: genId(),
    title: input.title,
    date: input.date,
    time: input.time,
    type: input.type,
    isCompleted: input.isCompleted ?? false,
    location: input.location,
    notes: input.notes,
    odValue: input.odValue,
    protocolId: input.protocolId,
  };
}

export const localTaskRepository: TaskRepository = {
  async list() {
    return [...store];
  },

  async create(input) {
    const task = buildTask(input);
    store = [...store, task];
    emit();
    return task;
  },

  async createMany(inputs) {
    const tasks = inputs.map(buildTask);
    store = [...store, ...tasks];
    emit();
    return tasks;
  },

  async update(id, patch) {
    let updated: ExperimentTask | undefined;
    store = store.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...patch, id: t.id };
      return updated;
    });
    if (!updated) throw new Error(`Task not found: ${id}`);
    emit();
    return updated;
  },

  async remove(id) {
    store = store.filter((t) => t.id !== id);
    emit();
  },

  subscribe(onChange) {
    listeners.add(onChange);
    // 購読開始時に現在のスナップショットを即時配信（onSnapshot と同様）
    onChange([...store]);
    return () => {
      listeners.delete(onChange);
    };
  },
};
