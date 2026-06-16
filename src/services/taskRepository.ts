import type { ExperimentTask } from "@/lib/types";
import { localTaskRepository } from "./localTaskRepository";
// 将来 Firebase へ移行する際は下記を有効化:
// import { firebaseTaskRepository } from "./firebaseTaskRepository";

/**
 * 新規タスク作成時の入力。
 * id はストレージ側（将来は Firestore）が採番するため含めない。
 * isCompleted は省略時 false。
 */
export interface NewTaskInput {
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  type: "idle" | "active";
  isCompleted?: boolean;
  notes?: string;
  odValue?: number;
  protocolId?: string;
}

/**
 * タスクの永続化を担う抽象インターフェース（データアクセス層）。
 *
 * UI／フックはこのインターフェースにのみ依存し、実体（ローカルのインメモリか、
 * 将来の Firebase/Firestore か）を知らない。これにより、後から API 通信実装に
 * 差し替えるだけで Web と iPhone アプリのデータ同期へ移行できる。
 *
 * 全メソッドは Promise を返す（将来のネットワーク通信を前提とした非同期設計）。
 */
export interface TaskRepository {
  /** 全タスクを取得 */
  list(): Promise<ExperimentTask[]>;
  /** 1件作成（採番された完全な ExperimentTask を返す） */
  create(input: NewTaskInput): Promise<ExperimentTask>;
  /** 複数件をまとめて作成（プロトコル展開など） */
  createMany(inputs: NewTaskInput[]): Promise<ExperimentTask[]>;
  /** 部分更新（OD値・メモ・完了フラグなど） */
  update(
    id: string,
    patch: Partial<Omit<ExperimentTask, "id">>
  ): Promise<ExperimentTask>;
  /** 削除 */
  remove(id: string): Promise<void>;
  /**
   * リアルタイム同期の購読（Firestore の onSnapshot 相当）。
   * 変更があるたびに最新の全タスクが callback に渡される。
   * 返り値は購読解除関数。リアルタイム同期に対応しない実装では未定義。
   */
  subscribe?(onChange: (tasks: ExperimentTask[]) => void): () => void;
}

/**
 * 現在有効なリポジトリ実装を返すファクトリ。
 * ここが唯一の差し替えポイント。Firebase 移行時はこの分岐を切り替えるだけでよい。
 */
export function getTaskRepository(): TaskRepository {
  // 例: 環境変数でバックエンドを切り替える
  // if (process.env.NEXT_PUBLIC_DATA_BACKEND === "firebase") {
  //   return firebaseTaskRepository;
  // }
  return localTaskRepository;
}
