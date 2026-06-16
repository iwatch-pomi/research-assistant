import type { ExperimentTask } from "./types";
import { toDateTime } from "./date";

/**
 * 次に来る「拘束(active)」タスクを返す（未完了・時刻指定あり・現在時刻以降のうち最も近いもの）。
 * ダッシュボードのカウントダウン対象。該当が無ければ null。
 */
export function getNextActiveTask(
  tasks: ExperimentTask[],
  now: Date = new Date()
): ExperimentTask | null {
  const upcoming = tasks
    .filter((t) => t.type === "active" && !t.isCompleted && t.time)
    .map((t) => ({ task: t, at: toDateTime(t.date, t.time) }))
    .filter(({ at }) => at.getTime() >= now.getTime())
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  return upcoming.length > 0 ? upcoming[0].task : null;
}
