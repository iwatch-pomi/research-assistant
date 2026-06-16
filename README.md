# LabFlow

ウェットバイオ系・微生物系の高専卒研生／大学学部生向けの、実験スケジュール管理＆記録を行う**モバイルファースト Web アプリ**の MVP です。

実験は「放置（培養・インキュベートなどで手が空く時間）」と「拘束（仕込み・PCR・電気泳動など手が離せない時間）」が入り混じります。LabFlow はこの2種類を仕分けて可視化し、**拘束タスク同士の衝突だけ**を警告することで、賢いマルチタスク計画を支援します。

## 主な機能

1. **月表示カレンダー（メイン画面）** — 日付マスに当日の実験タスクをコンパクト表示。
2. **放置 / 拘束の仕分け表示**
   - 放置（idle）: 薄い背景＋点線枠（手作業がないことを可視化）
   - 拘束（active）: 濃い背景（鮮やかなブルー）で強調
3. **賢いマルチタスク警告** — 同じ日に拘束タスク同士が重なったときだけ、日付マスを赤リング＋⚠️で警告。放置の裏に拘束が重なっても警告しない。
4. **実験記録のメリハリ**
   - 放置: 1タップで完了する超軽量チェック（例: インキュベーター温度確認）
   - 拘束: OD600 値の入力欄・メモ・写真追加（ダミー）がある穴埋めフォーム
5. **プロトコルの QR シェア（モック）** — 先輩のプロトコル概要とダミー QR を表示。「インポート」で放置・拘束を仕分けた3日間スケジュールをカレンダーへ自動展開。

## 技術スタック

- Next.js (App Router) + TypeScript
- Tailwind CSS v4（素の Tailwind コンポーネント、shadcn 未使用）
- lucide-react（アイコン）
- 状態管理: React `useState` + Context（インメモリのモックデータ。DB 接続なし）

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を**スマホサイズ**で開くと最適に表示されます。

```bash
npm run build   # 本番ビルド
npm run lint    # ESLint
```

## ディレクトリ構成

```
src/
  app/
    page.tsx          # メイン: 月表示カレンダー
    share/page.tsx    # プロトコル QR シェア（モック）
    layout.tsx        # TaskProvider でラップ
  components/
    CalendarMonth.tsx # 月グリッド＋月送り
    DayCell.tsx       # 日付マス（放置/拘束/衝突の表示）
    TaskRecordSheet.tsx # 記録フォーム（放置=チェック / 拘束=穴埋め）
    BottomSheet.tsx   # 簡易ボトムシート
    BottomNav.tsx     # カレンダー / 共有 タブ
    DummyQR.tsx       # インライン SVG のダミー QR
  context/
    TaskContext.tsx   # タスク状態とアクション
  lib/
    types.ts          # 型定義（ExperimentTask / ProtocolTemplate）
    conflicts.ts      # コンフリクト検知（拘束同士のみ警告）
    date.ts           # 日付ユーティリティ（標準 Date のみ）
    mockData.ts       # 初期サンプルタスク
    mockProtocols.ts  # 共有プロトコルのモック
```

> MVP のためデータは永続化されません（リロードで初期状態に戻ります）。
