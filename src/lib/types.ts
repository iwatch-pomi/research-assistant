// LabFlow 共通の型定義

/** 実験タスク（プロトコルの1ステップ） */
export interface ExperimentTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  type: "idle" | "active"; // idle=放置 / active=拘束
  isCompleted: boolean;
  location?: string; // 場所（例: 実験室A / 培養室 / 分析室B）
  notes?: string;
  odValue?: number; // 拘束タスク用のダミーデータ（OD600 など）
  protocolId?: string; // どのプロトコル由来か（任意）
}

/** プロトコルの1ステップ（テンプレート内、相対日数で定義） */
export interface ProtocolStep {
  title: string;
  dayOffset: number; // 開始日からの相対日数（0,1,2,...）
  time?: string; // HH:MM
  type: "idle" | "active";
  location?: string; // 場所
}

/** 共有可能なプロトコルテンプレート */
export interface ProtocolTemplate {
  id: string;
  name: string; // 例: 大腸菌形質転換・培養パック
  description: string;
  durationDays: number;
  author: string; // 例: 先輩の名前
  version?: string; // 例: "2.1"
  verified?: boolean; // 検証済みバッジ
  steps: ProtocolStep[];
}
