import type { ExperimentTask } from "./types";
import { todayISO, addDays, toISODate } from "./date";

// 起動時に現在の月へ表示されるよう、今日を基準にした相対日付でサンプルを生成。
const t0 = todayISO();

// ダッシュボードのカウントダウンが「生きて」見えるよう、
// 次の拘束タスクを「今からおよそ25分後」に配置する（読み込み時に算出）。
const soon = new Date();
soon.setMinutes(soon.getMinutes() + 25);
const soonDate = toISODate(soon);
const soonTime = `${String(soon.getHours()).padStart(2, "0")}:${String(
  soon.getMinutes()
).padStart(2, "0")}`;

export const INITIAL_TASKS: ExperimentTask[] = [
  // 昨日: 放置タスク（完了済みの例）
  {
    id: "seed-1",
    title: "インキュベーター温度確認",
    date: addDays(t0, -1),
    time: "09:00",
    type: "idle",
    location: "培養室",
    isCompleted: true,
  },
  // 今日: 仕込み（拘束・完了済み）
  {
    id: "seed-2",
    title: "大腸菌の植菌",
    date: t0,
    time: "09:00",
    type: "active",
    location: "実験室A",
    isCompleted: true,
    notes: "シングルコロニーを3本植菌",
  },
  // 今日: 次の拘束タスク（カウントダウン対象）
  {
    id: "seed-next",
    title: "OD測定＆サンプリング",
    date: soonDate,
    time: soonTime,
    type: "active",
    location: "培養室",
    isCompleted: false,
  },
  // 今日: 放置（培養）— active の裏に idle なので警告なし
  {
    id: "seed-3",
    title: "37℃ 振盪培養（本培養）",
    date: t0,
    time: "16:00",
    type: "idle",
    location: "培養室",
    isCompleted: false,
  },
  // 今日: 拘束（夕方）
  {
    id: "seed-4",
    title: "PCR ＆ 電気泳動",
    date: t0,
    time: "18:00",
    type: "active",
    location: "分析室B",
    isCompleted: false,
  },
  // 明日: 放置タスク
  {
    id: "seed-5",
    title: "本培養（OD測定まで放置）",
    date: addDays(t0, 1),
    type: "idle",
    location: "培養室",
    isCompleted: false,
  },
  // 2日後: 拘束タスク同士の衝突例 ⚠️
  {
    id: "seed-6",
    title: "IPTG 誘導",
    date: addDays(t0, 2),
    time: "11:00",
    type: "active",
    location: "実験室A",
    isCompleted: false,
  },
  {
    id: "seed-7",
    title: "SDS-PAGE 電気泳動",
    date: addDays(t0, 2),
    time: "11:00",
    type: "active",
    location: "分析室B",
    isCompleted: false,
  },
  // 4日後: 拘束タスク（単独）
  {
    id: "seed-8",
    title: "タンパク精製（カラム）",
    date: addDays(t0, 4),
    time: "13:00",
    type: "active",
    location: "分析室B",
    isCompleted: false,
  },
];
