/* eslint-disable @typescript-eslint/no-unused-vars -- 未実装の雛形のため引数は意図的に未使用 */
import type { ExperimentTask } from "@/lib/types";
import type { NewTaskInput, TaskRepository } from "./taskRepository";

/**
 * Firebase / Firestore 版リポジトリの「雛形（未実装）」。
 *
 * このファイルは将来 Web と iPhone アプリでデータを同期させるための実装の
 * 置き場所です。`getTaskRepository()`（taskRepository.ts）の分岐をこの実装に
 * 切り替えるだけで、UI・カスタムフック側を一切変更せずにクラウド同期へ移行できます。
 *
 * 実装手順の例（Firestore の場合）:
 *   1. `npm install firebase` し、`src/lib/firebase.ts` で initializeApp / getFirestore。
 *   2. コレクション `tasks`（ユーザーごとに `users/{uid}/tasks` 等）を用意。
 *   3. 下記メソッドを Firestore SDK で実装:
 *      - list()       → getDocs(collection(db, "tasks"))
 *      - create()     → addDoc(...)（id は doc.id を採用）
 *      - createMany() → writeBatch(...) で一括追加
 *      - update()     → updateDoc(doc(db, "tasks", id), patch)
 *      - remove()     → deleteDoc(doc(db, "tasks", id))
 *      - subscribe()  → onSnapshot(query(...), cb) ※ Web/iPhone 間のリアルタイム同期の要
 *
 * ExperimentTask の型はそのまま Firestore ドキュメントのスキーマとして利用可能。
 */
export const firebaseTaskRepository: TaskRepository = {
  async list(): Promise<ExperimentTask[]> {
    throw new Error("firebaseTaskRepository.list() は未実装です");
  },

  async create(_input: NewTaskInput): Promise<ExperimentTask> {
    throw new Error("firebaseTaskRepository.create() は未実装です");
  },

  async createMany(_inputs: NewTaskInput[]): Promise<ExperimentTask[]> {
    throw new Error("firebaseTaskRepository.createMany() は未実装です");
  },

  async update(
    _id: string,
    _patch: Partial<Omit<ExperimentTask, "id">>
  ): Promise<ExperimentTask> {
    throw new Error("firebaseTaskRepository.update() は未実装です");
  },

  async remove(_id: string): Promise<void> {
    throw new Error("firebaseTaskRepository.remove() は未実装です");
  },

  subscribe(_onChange: (tasks: ExperimentTask[]) => void): () => void {
    throw new Error("firebaseTaskRepository.subscribe() は未実装です");
  },
};
