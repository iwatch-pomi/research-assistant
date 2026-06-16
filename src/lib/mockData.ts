import type { ExperimentTask } from "./types";
import { todayISO, addDays } from "./date";

// 起動時に現在の月へ表示されるよう、今日を基準にした相対日付でサンプルを生成。
const t0 = todayISO();

export const INITIAL_TASKS: ExperimentTask[] = [
  // 昨日: 放置タスク（完了済みの例）
  {
    id: "seed-1",
    title: "インキュベーター温度確認",
    date: addDays(t0, -1),
    time: "09:00",
    type: "idle",
    isCompleted: true,
  },
  // 今日: 拘束タスク（仕込み）
  {
    id: "seed-2",
    title: "培地調製・オートクレーブ",
    date: t0,
    time: "10:00",
    type: "active",
    isCompleted: false,
  },
  // 今日: 放置タスク（培養）— active の裏に idle なので警告なし
  {
    id: "seed-3",
    title: "37℃ 振盪培養（前培養）",
    date: t0,
    time: "16:00",
    type: "idle",
    isCompleted: false,
  },
  // 明日: 放置タスク（培養継続）
  {
    id: "seed-4",
    title: "本培養（OD測定まで放置）",
    date: addDays(t0, 1),
    type: "idle",
    isCompleted: false,
  },
  // 2日後: 拘束タスク同士の衝突例 ⚠️
  {
    id: "seed-5",
    title: "OD600 測定・誘導（IPTG）",
    date: addDays(t0, 2),
    time: "11:00",
    type: "active",
    isCompleted: false,
  },
  {
    id: "seed-6",
    title: "SDS-PAGE 電気泳動",
    date: addDays(t0, 2),
    time: "11:00",
    type: "active",
    isCompleted: false,
  },
  // 4日後: 拘束タスク（単独・衝突なし）
  {
    id: "seed-7",
    title: "タンパク精製（カラム）",
    date: addDays(t0, 4),
    time: "13:00",
    type: "active",
    isCompleted: false,
  },
];
