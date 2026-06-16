// 標準 Date のみを使った日付ユーティリティ（外部ライブラリ不使用）

/** Date を YYYY-MM-DD 形式（ローカル時刻基準）に変換 */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** YYYY-MM-DD をローカル Date に変換 */
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 今日の YYYY-MM-DD */
export function todayISO(): string {
  return toISODate(new Date());
}

/** YYYY-MM-DD から n 日後の YYYY-MM-DD */
export function addDays(iso: string, n: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** 「6月16日(火)」のような表示用フォーマット */
const WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"];

export function formatDateLabel(iso: string): string {
  const d = fromISODate(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日(${WEEKDAY_JA[d.getDay()]})`;
}

export function weekdayLabels(): string[] {
  return WEEKDAY_JA;
}

/** 「2026年6月」のような月見出し */
export function formatMonthLabel(year: number, month0: number): string {
  return `${year}年${month0 + 1}月`;
}

export interface CalendarCell {
  iso: string; // YYYY-MM-DD
  day: number; // 日にち
  inMonth: boolean; // 表示中の月に属するか
  isToday: boolean;
}

/**
 * 月表示カレンダーのセル配列（前後月の埋めセルを含む 6 週 = 42 マス）を生成。
 * 週は日曜始まり。
 */
export function buildMonthGrid(year: number, month0: number): CalendarCell[] {
  const today = todayISO();
  const first = new Date(year, month0, 1);
  const startOffset = first.getDay(); // 日曜=0
  const gridStart = new Date(year, month0, 1 - startOffset);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const iso = toISODate(d);
    cells.push({
      iso,
      day: d.getDate(),
      inMonth: d.getMonth() === month0,
      isToday: iso === today,
    });
  }
  return cells;
}
