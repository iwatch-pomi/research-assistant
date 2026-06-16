import type { ProtocolTemplate } from "./types";

/**
 * 先輩が作った共有プロトコル（モック）。
 * 放置(idle)と拘束(active)が仕分けされた3日間スケジュール。
 */
export const SHARED_PROTOCOLS: ProtocolTemplate[] = [
  {
    id: "proto-transformation",
    name: "大腸菌形質転換・培養パック",
    description:
      "コンピテントセルへのプラスミド導入から、コロニー確認・液体培養までの定番3日間プロトコル。仕込みの拘束時間と、一晩培養などの放置時間を自動で仕分けします。",
    durationDays: 3,
    author: "Dr. A. Tanaka",
    version: "2.1",
    verified: true,
    steps: [
      // Day 0: 仕込み（拘束）→ 一晩培養（放置）
      {
        title: "形質転換（ヒートショック・播種）",
        dayOffset: 0,
        time: "14:00",
        type: "active",
        location: "実験室A",
      },
      {
        title: "37℃ 一晩培養（LB寒天プレート）",
        dayOffset: 0,
        time: "18:00",
        type: "idle",
        location: "培養室",
      },
      // Day 1: コロニー確認（拘束）→ 液体培養（放置）
      {
        title: "コロニー確認・シングルコロニー植菌",
        dayOffset: 1,
        time: "10:00",
        type: "active",
        location: "実験室A",
      },
      {
        title: "37℃ 振盪 液体培養（一晩）",
        dayOffset: 1,
        time: "11:00",
        type: "idle",
        location: "培養室",
      },
      // Day 2: 回収（拘束）
      {
        title: "菌体回収・グリセロールストック作製",
        dayOffset: 2,
        time: "09:30",
        type: "active",
        location: "実験室A",
      },
      {
        title: "プラスミド抽出（ミニプレップ）",
        dayOffset: 2,
        time: "13:00",
        type: "active",
        location: "分析室B",
      },
    ],
  },
  {
    id: "proto-pcr-electro",
    name: "コロニーPCR・電気泳動パック",
    description:
      "コロニーPCRで増幅し、アガロースゲル電気泳動でインサートを確認する1日完結プロトコル。",
    durationDays: 1,
    author: "佐藤 先輩",
    steps: [
      {
        title: "PCR 反応液調製・サーマルサイクラー",
        dayOffset: 0,
        time: "10:00",
        type: "active",
        location: "分析室B",
      },
      {
        title: "アガロースゲル作製・電気泳動",
        dayOffset: 0,
        time: "13:30",
        type: "active",
        location: "分析室B",
      },
    ],
  },
];
