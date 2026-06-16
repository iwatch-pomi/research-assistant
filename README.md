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
- データアクセス: リポジトリ層で抽象化（後述）。将来 Firebase/Firestore へ差し替え可能

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を**スマホサイズ**で開くと最適に表示されます。

> スマホ実機で見たいときは、同一 Wi‑Fi 上で `npm run dev -- -H 0.0.0.0` を実行し、
> スマホのブラウザから `http://<PCのIPアドレス>:3000` を開きます。

```bash
npm run build   # 本番ビルド
npm run lint    # ESLint
```

## デプロイ（Vercel で公開）

PC・スマホ（iPhone）の両方から開ける公開URLを発行できます。Next.js なので **Vercel はゼロ設定**（環境変数・追加設定なし）でデプロイできます。

1. [vercel.com/new](https://vercel.com/new) にアクセスし、GitHub アカウントを連携。
2. リポジトリ `iwatch-pomi/research-assistant` を **Import**。
3. **Production Branch** にこのアプリのブランチ（例: `claude/jolly-carson-iig1od`、または `main` へマージ済みなら `main`）を指定。
4. Framework は Next.js が自動検出されるので、そのまま **Deploy**。
5. 数十秒で `https://<プロジェクト名>.vercel.app` が発行され、PC・スマホどちらのブラウザからも開けます。以後、そのブランチへ push するたび自動で再デプロイされます。

> **データに関する注意**: 現状はインメモリのモックのため、**ページをリロードすると初期状態に戻り、端末間でのデータ同期はありません**。
> Web ↔ iPhone のリアルタイム同期は、将来 `src/services/firebaseTaskRepository.ts` を有効化した時点で実現できます（差し替え口は `getTaskRepository()` の1箇所のみ）。

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
    TaskContext.tsx   # タスクストアをツリーへ配る薄い Provider
  hooks/
    useTaskStore.ts   # リポジトリ層と React 状態を橋渡しするカスタムフック
  services/           # ★データアクセス層（保存・更新の処理を分離）
    taskRepository.ts        # TaskRepository インターフェース ＋ getTaskRepository() ファクトリ
    localTaskRepository.ts   # 現在の実装（インメモリ＋onSnapshot 相当の購読）
    firebaseTaskRepository.ts # 将来の Firebase 実装の雛形（差し替え先）
  lib/
    types.ts          # 型定義（ExperimentTask / ProtocolTemplate）
    conflicts.ts      # コンフリクト検知（拘束同士のみ警告）
    date.ts           # 日付ユーティリティ（標準 Date のみ）
    mockData.ts       # 初期サンプルタスク
    mockProtocols.ts  # 共有プロトコルのモック
```

> MVP のためデータは永続化されません（リロードで初期状態に戻ります）。

## データアクセス層（クラウド DB 移行の設計）

将来 Firebase などのクラウド DB と接続し、**Web と iPhone アプリでデータを同期**できるよう、データの保存・取得・更新の処理はコンポーネントから切り離してあります。

```
UI コンポーネント
   ↓ （useTasks）
TaskContext        … ストアをツリーへ配るだけ
   ↓
useTaskStore (hook) … リポジトリ ⇄ React 状態の橋渡し、プロトコル展開
   ↓ （getTaskRepository）
TaskRepository      … 抽象インターフェース（Promise ベースの非同期 CRUD ＋ subscribe）
   ├─ localTaskRepository    … 現在: インメモリ（onSnapshot 相当の購読つき）
   └─ firebaseTaskRepository … 将来: Firestore 実装（雛形あり）
```

- 書き込み系（`create` / `update` / `remove` / `createMany`）はすべて **Promise を返す非同期 API** なので、そのまま Firestore SDK や REST 通信へ置き換えられます。
- `subscribe()` は Firestore の `onSnapshot` 相当で、リアルタイム同期（複数端末間の自動反映）の受け口です。
- **差し替えポイントは `getTaskRepository()`（`src/services/taskRepository.ts`）の 1 箇所のみ**。`firebaseTaskRepository` を返すよう切り替えれば、UI・フックは無変更でクラウド同期へ移行できます（例: 環境変数 `NEXT_PUBLIC_DATA_BACKEND` で分岐）。
- `firebaseTaskRepository.ts` に Firestore での実装手順（`getDocs` / `addDoc` / `onSnapshot` など）をコメントで記載しています。
