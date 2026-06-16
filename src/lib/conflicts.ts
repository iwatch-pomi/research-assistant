import type { ExperimentTask } from "./types";

/**
 * 賢いマルチタスク警告（コンフリクト検知）のコアロジック。
 *
 * ルール:
 *  - 警告は「拘束タスク(active)」同士が同じ日に重なった場合のみ。
 *  - 「放置タスク(idle)」は何個重なっても、active の裏に idle が重なっても警告しない
 *    （放置中は手が空くのでマルチタスク可能と判定）。
 *  - active 同士は、time が無い場合は「終日拘束」とみなし他の active 全てと衝突。
 *    time がある場合は、同一時刻 または 相手が終日(time無し)のときのみ衝突
 *    （別々の時間帯ならマルチタスク可能）。
 */

function activeTasksConflict(a: ExperimentTask, b: ExperimentTask): boolean {
  // 片方でも時刻未指定なら終日拘束として衝突扱い
  if (!a.time || !b.time) return true;
  // 同一時刻帯のみ衝突
  return a.time === b.time;
}

/** 指定日の active タスクのうち、衝突しているタスクの id 集合を返す */
export function getConflictingTaskIds(
  tasks: ExperimentTask[],
  date: string
): Set<string> {
  const actives = tasks.filter((t) => t.date === date && t.type === "active");
  const conflicting = new Set<string>();

  for (let i = 0; i < actives.length; i++) {
    for (let j = i + 1; j < actives.length; j++) {
      if (activeTasksConflict(actives[i], actives[j])) {
        conflicting.add(actives[i].id);
        conflicting.add(actives[j].id);
      }
    }
  }
  return conflicting;
}

/** 指定日に拘束タスクの衝突があるか */
export function hasActiveConflict(
  tasks: ExperimentTask[],
  date: string
): boolean {
  return getConflictingTaskIds(tasks, date).size > 0;
}

/**
 * これからタスク群を追加した場合に新たな衝突が起きる日付の集合を返す
 * （プロトコルのインポートプレビューなどで使用）。
 */
export function previewConflictDates(
  existing: ExperimentTask[],
  incoming: ExperimentTask[]
): Set<string> {
  const merged = [...existing, ...incoming];
  const dates = new Set(incoming.map((t) => t.date));
  const result = new Set<string>();
  for (const date of dates) {
    if (hasActiveConflict(merged, date)) result.add(date);
  }
  return result;
}
