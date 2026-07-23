# BoatMeter v2 Proposal

## 0. 前提とルール
- 本書は設計のみを対象とし、コード変更やファイル移動は行わない
- 現行構成から段階的に移行できることを重視する
- GitHub にはソースコードのみを保存し、測定データや位置情報は端末内保存を前提とする

## 1. 現状構成の分析

### 1.1 ファイル構成
- `index.html` - メイン表示画面の HTML
- `app.js` - センサー取得、GPS、角度計算、UI 更新、状態管理をすべて含むメインロジック
- `style.css` - メイン画面のスタイル
- `viewer.html` - CSV を読み込んで地図とグラフを表示する解析画面
- `viewer.js` - CSV パース、Leaflet 地図、Chart.js グラフ、再生・スライダー制御
- `manifest.json` - PWA マニフェスト
- 画像リソース: `ponam-rear.png`, `ponam-side.png`

### 1.2 現在の機能概観
- デバイスの `deviceorientation` の roll/pitch を取得し、UI に反映
- GPS 位置と速度を取得
- 画面回転やランドスケープ判定による傾き補正
- 解析画面で CSV ファイルを手動読み込みし、軌跡とグラフを表示
- 再生タイマーとスライダー操作によるトラッキング再生

### 1.3 現状コードの構造特徴
- グローバル変数中心の設計
- DOM API 直接操作による状態管理
- UI 表示とロジックが単一ファイルに混在
- データ保存や履歴管理は未実装に近い
- 解析ロジックは CSV インポート前提であり、アプリ内保存連携がない

## 2. 問題点

### 2.1 保守性・拡張性の不足
- ビジネスロジック、UI、状態管理、データフォーマットが分離されていない
- 既存コードにはコンポーネント化やサービス層がないため、段階的リファクタリングが必要
- `viewer` の機能は解析専用化されておらず、将来の機能追加に対しても脆い

### 2.2 データ管理の欠如
- セッション/トラックポイントの型定義がない
- 端末保存レイヤーが存在しない
- 保存済みデータの再利用や履歴一覧、検索が未設計

### 2.3 UX / UI アーキテクチャの問題
- メイン画面と解析画面が別ページ構成だが、共通 UI も共通基盤もない
- SVG レイヤーやアニメーションを前提とした UI ではない
- 画面構成が固定的で、拡張時のレイアウト変更コストが高い

### 2.4 セキュリティ・運用上の懸念
- 現状はデータ保存機構がないため、Github 保存ルールとデータ隔離方針を明文化する必要がある
- GPS などの位置情報は端末内に閉じ、エクスポート時のみ外部化する設計が必須

## 3. 推奨フォルダ構成（最終採用）

```
BoatMeter/
├── public/
│   ├── index.html
│   ├── viewer.html
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── images/
│   │   ├── ponam-rear.png
│   │   └── ponam-side.png
│   └── assets/
│       ├── svg/
│       └── fonts/
├── src/
│   ├── app/
│   │   ├── main.js
│   │   ├── sensor.js
│   │   ├── gps.js
│   │   ├── session.js
│   │   └── recorder.js
│   ├── viewer/
│   │   ├── main.js
│   │   ├── list.js
│   │   ├── map.js
│   │   ├── chart.js
│   │   ├── playback.js
│   │   └── ui.js
│   ├── storage/
│   │   ├── indexeddb.js
│   │   ├── export.js
│   │   ├── import.js
│   │   └── schema.js
│   ├── physics/
│   │   ├── model.js
│   │   ├── boat.js
│   │   ├── sea.js
│   │   └── metrics.js
│   ├── ui/
│   │   ├── components.js
│   │   ├── layout.js
│   │   └── theme.js
│   ├── data/
│   │   ├── schema.js
│   │   ├── analytics.js
│   │   └── transforms.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   └── utils/
│       ├── angle.js
│       ├── time.js
│       ├── dom.js
│       ├── math.js
│       └── perf.js
├── docs/
│   └── proposal-v2.md
├── dist/
├── tests/
├── package.json
├── package-lock.json
└── README.md
```

## 4. 各モジュールの責務

### 4.1 `src/app`
役割: センサー取得、セッション管理、リアルタイム UI 更新、記録制御。
- `main.js` - ページ初期化、イベントバインディング、画面状態遷移
- `sensor.js` - `DeviceOrientationEvent` と `DeviceMotionEvent` の抽象化、権限要求、状況判定
- `gps.js` - `navigator.geolocation` のラップ、位置・速度・精度の公開、watchPosition 管理
- `session.js` - `Session` と `TrackPoint` の状態管理、現在値キャッシュ、メタデータ保持
- `recorder.js` - 録画開始/停止、書き込みタイミング、バッファ管理、IndexedDB 保存トリガー

### 4.2 `src/viewer`
役割: 保存済みデータの一覧、読み込み、地図・グラフ・再生 UI。
- `main.js` - 解析画面全体の初期化、ストレージ・UI の連携
- `list.js` - セッション一覧、フィルタ、検索、インポート/エクスポート操作
- `map.js` - 地図表示、航跡描画、位置マーカー制御
- `chart.js` - 角度・速度グラフの描画、カーソル同期、ズーム/軸設定
- `playback.js` - 時間軸再生、スピード制御、再生状態管理
- `ui.js` - 解析パネル、詳細表示、モーダル、レスポンシブ調整

### 4.3 `src/storage`
役割: 端末内保存・読み込み・エクスポート・インポート・マイグレーション。
- `indexeddb.js` - DB 接続、オブジェクトストア、インデックス、アップグレード処理、障害復旧
- `export.js` - CSV / JSON / ZIP 形式の出力、マスク処理、エクスポート設定
- `import.js` - CSV / JSON 取り込み、フォーマット検証、データ整形
- `schema.js` - IndexedDB スキーマ定義、ストレージ型の契約

### 4.4 `src/physics`
役割: 船体姿勢推定、船種モデル、波/風影響、派生指標。
- `model.js` - センサー融合、補正、estimatedRoll など推定値の生成
- `boat.js` - 船種パラメータ、係数、安定性・応答特性の定義
- `sea.js` - 波高/波向/風速/流速の影響モデル、外力計算
- `metrics.js` - lateralG、rollResidual、heelingIndex など派生値の定義・計算

### 4.5 `src/ui`
役割: 共通 UI コンポーネント、テーマ、レイアウト。
- `components.js` - ボタン、カード、スイッチ、計器フレームなど共通部品
- `layout.js` - ページ構造、レスポンシブグリッド、モーダルレイアウト
- `theme.js` - 色・フォント・シャドウ・アニメーションの一貫定義

### 4.6 `src/data`
役割: データ型、派生値計算、フォーマット変換。
- `schema.js` - `Session` / `TrackPoint` / `DerivedData` の型定義
- `analytics.js` - 派生データ算出ロジック、集計、統計、評価指標
- `transforms.js` - CSV/JSON ↔ 内部データ形式の双方向変換

### 4.7 `src/utils`
役割: 補助関数と性能最適化。
- `angle.js` - 角度正規化、回転変換、サイン/コサイン補助
- `time.js` - タイムスタンプ生成、経過時間計算、表示フォーマット
- `dom.js` - DOM 要素取得、属性更新、イベント管理の補助
- `math.js` - 平滑化、補間、フィルタ、統計計算
- `perf.js` - サンプリングレート制御、メモリ/描画負荷抑制

## 5. IndexedDB のデータ構造とバージョン管理

### 5.1 データ構造
- DB 名: `BoatMeterDB`
- バージョン: 現状は `1` から開始し、変更ごとにインクリメント
- オブジェクトストア:
  - `sessions` (keyPath: `id`)
    - index: `startedAt`
    - index: `boatType`
    - index: `source`
  - `trackPoints` (keyPath: `pointId` または `id`)
    - index: `sessionId`
    - index: `elapsed`
  - `derivedMetrics` (keyPath: `sessionId`)
    - session ごとの集計結果と評価指標

### 5.2 `Session` スキーマ
- `id`: UUID
- `name`: セッション名
- `source`: `live` / `imported`
- `boatType`: モデル識別子
- `startedAt`: ISO タイムスタンプ
- `endedAt`: ISO タイムスタンプまたは null
- `recordCount`: トラックポイント数
- `meta`: `{ weather, seaState, comment, tags }`
- `stats`: 保存時に算出する集計値
- `version`: データ形式バージョン

### 5.3 `TrackPoint` スキーマ
- `id` / `pointId`: UUID
- `sessionId`: 所属セッションの UUID
- `timestamp`: ISO タイムスタンプ
- `elapsed`: 経過秒
- `lat`, `lng`
- `roll`, `pitch`
- `speed`
- `heading`
- `turnRate`
- `radius`
- `lateralG`
- `estimatedRoll`
- `rollResidual`
- `quality`: 信頼度/ステータス
- `sampleSource`: `deviceorientation` / `sensorfusion` / `imported`

### 5.4 `DerivedData` / `Session.stats`
- `averageRoll`, `maxRoll`, `minRoll`
- `averagePitch`, `maxPitch`, `minPitch`
- `rmsPitch`
- `maxTurnRate` / `averageTurnRate`
- `averageSpeed` / `maxSpeed`
- `maxLateralG`
- `waveInfluence` / `heelingIndex`
- `stabilityMargin`
- `estimatedRollVariance`

### 5.5 バージョン管理とマイグレーション
- `indexeddb.js` は `onupgradeneeded` ハンドラでバージョンごとの変更を実装
- 変更例:
  - `v1`: `sessions`, `trackPoints`, `derivedMetrics`
  - `v2`: `lateralG`, `estimatedRoll`, `rollResidual` を `trackPoints` に追加
  - `v3`: `boatType` 設定や `meta` を拡張
- マイグレーション手順:
  1. 現行オブジェクトストアのコピー/再構築
  2. 既存レコードの変換と新フィールドの追加
  3. 失敗時はバックアップ用 JSON エクスポートを促す
- `version` プロパティを各 `Session` に保持し、レコード単位でも形式を判別可能にする

### 5.6 データ移行・障害復旧
- アプリ起動時に DB 開けない場合、ユーザーにエラーメッセージと復旧手順を提示
- `export.js` で JSON バックアップを容易に作成できる
- `import.js` で復旧用 JSON を読み込み直し、欠落フィールドを補完
- DB の破損検出時は `indexeddb.deleteDatabase` で再作成し、バックアップからの復元を誘導
- セッション一覧に「バックアップを作成」や「インポート」操作を追加

### 5.7 CSV / JSON の役割
- CSV:
  - ユーザー共有・外部解析向けのテキスト形式
  - 時系列レコードを中心に、必要最小限の項目を出力
  - GPS 座標、角度、速度、heading/turnRate/radius などを含める
  - プライバシーのため座標マスクオプションを設ける
- JSON:
  - 内部セッションアーカイブ/バックアップ向け
  - `Session` / `TrackPoint` / `DerivedData` をそのまま保存
  - `version` と `meta` を保持し、再インポート時の完全復元やアプリ間同期に適する
- 方針: Viewer では基本的に JSON から読み込み、CSV はインポートやエクスポートのための補助形式とする

### 5.8 解析用データの再計算ポリシー
- Viewer は保存済み `DerivedData` を原則使用し、表示時にフル再計算しない
- 追加派生値が必要な場合は軽量な補正・フィルタのみ行い、本格計算は保存時に実行
- これにより Viewer の負荷を抑えつつ、実機計測と解析の整合性を保つ

## 6. 計測開始から Viewer 表示までのデータフロー

1. ユーザーが `app` 画面で計測開始を押す
2. `sensor.js` がセンサー権限を要求し、`gps.js` が GPS 取得を開始
3. `session.js` が新規 `Session` を作成し、メタデータと開始時刻を記録
4. `recorder.js` が定期的に `TrackPoint` を生成し、センサー/GPS データをバッファに蓄積
5. `physics/model.js` が必要に応じて `estimatedRoll` や `lateralG` を計算し、各 `TrackPoint` に付与
6. `analytics.js` がセッションの `DerivedData` を保存時に計算し、`Session.stats` として保存
7. `storage/indexeddb.js` が `Session`、`TrackPoint`、`DerivedMetrics` を IndexedDB に永続化
8. ユーザーが `viewer` を開くと、`viewer/main.js` が `StorageService` を通じてセッション一覧を取得
9. ユーザーがセッションを選択すると、`viewer` は `TrackPoint` と `DerivedData` をロードし、`map.js` / `chart.js` に渡す
10. `viewer` はあらかじめ保存された派生値を表示し、再生は `playback.js` が `elapsed` に従って実行

## 7. セキュリティとプライバシー方針

- GPS を含む計測データは端末の IndexedDB にのみ保存する
- 保存済みデータを GitHub へコミットしない
- CSV はエクスポート専用とし、共有時にのみ生成する
- JSON はアプリ内バックアップ/復元に限定し、外部公開はユーザー選択とする
- 共有用エクスポートでは座標削除・座標曖昧化・メタデータ除外を選択できるようにする
- 外部同期機能は Phase4 以降に導入し、ユーザー承認と暗号化を必須とする

## 8. Viewer構成

### 8.1 構成方針
- Viewer は `app` とは独立した読み出し専用の解析層とし、データ変更は原則行わない
- `StorageService` を介してローカル保存データを取得する
- UI は一覧→詳細→再生の順で段階的に操作できる
- 解析画面では保存済み `DerivedData` を参照して高速表示する

### 8.2 拡張しやすさ
- `heading` / `turnRate` / `radius` / `lateralG` / `estimatedRoll` / `rollResidual` は `TrackPoint` にオプション項目として追加
- 新しい派生値は `Session.stats` か `DerivedMetrics` に保存し、Viewer 側は表示用に追加するのみで対応可能
- 将来的な複数セッション比較やトレース重ね表示にも対応できるデータ構造にする

## 9. Physics構成

### 9.1 将来対応性
- `physics/boat.js` で船種ごとの係数や特性を定義し、`physics/model.js` から呼び出せる形にする
- `physics/sea.js` で波高・波向・風速を入力とする追加モデルを用意する
- `physics/metrics.js` で `rollResidual` や `lateralG` などの派生指標を定義し、保存時に計算できるようにする

### 9.2 表示観点
- ROLL は真後ろ視点に最適な SVG レイヤー構造とし、左右傾斜を強調する
- PITCH は真横視点に最適な横方向の傾き表現を持ち、船体前後の沈み/上がりを可視化する
- レイヤーの区分は船体、キャビン、窓、水平線、海面、波、グローの 6 層を想定し、アニメーション制御しやすい構成とする

## 10. デザイン構成

### 10.1 SVG レイヤー構成
- `ship-body` - 船体本体
- `cabin` - キャビン / デッキ
- `windows` - 窓・表示要素
- `horizon` - 水平線・姿勢補正線
- `sea` - 海面グラデーション
- `waves` - 波動表現
- `glow` - シアン発光ハイライト

### 10.2 視点適合性
- ROLL: 真後ろ視点により左右のロール角を視覚的に伝えやすくする
- PITCH: 真横視点により前後のピッチ変化と水平線との関係を明確化する
- 本設計はこの視点分離を前提とし、アニメーション/レイヤー調整時の解釈違いを減らす

### 10.3 モバイル性能・容量配慮
- 計測データは必要項目に絞り、TrackPoint に不要な冗長情報を蓄積しない
- サンプリングレートと保存頻度は調整可能にし、長時間記録時のストレージ負荷を制御
- Viewer では必要な区間のみ読み込むか、ページングする実装を想定してメモリ負荷を抑える
- IndexedDB は構造化データ保存のため、ストレージ容量が大きくても効率よく扱える

## 11. 開発ロードマップ

### 11.1 フェーズ 0: 設計
- 現行コードの分析と設計文書作成
- 最終フォルダ構成とモジュール責務の確定
- IndexedDB/データモデル/JSON/CSV 方針の確定
- Viewer/Physics/デザインの構成方針を固める
- 完了条件:
  - フォルダ構成を確定した設計文書がある
  - データモデルと保存方式が明文化されている
  - 画面遷移と責務分離の方針が明確になっている

### 11.2 フェーズ 1: 基盤構築
- `src/` プロジェクト構成の初期セットアップ
- `storage/indexeddb.js` と `schema.js` を定義
- `Session` / `TrackPoint` / `DerivedData` の型を実装
- `app` 画面に記録・セッション管理の基盤を追加
- `viewer` 側に保存済みデータ読み込みの基盤を追加
- 完了条件:
  - IndexedDB への `Session` / `TrackPoint` 保存・読み込みが動作する
  - 解析画面で保存済みセッションの一覧と基本表示ができる
  - `Session.stats` に保存した派生データを Viewer が表示できる

### 11.3 フェーズ 2: コア機能実装
- センサー取得と GPS 計測の安定化
- CSV/JSON のエクスポート・インポート機能
- Viewer の地図/グラフ/再生機能を実装
- 初期派生指標と基本物理推定を実装
- 完了条件:
  - 計測データを端末内に保存し、Viewer で再生・表示できる
  - CSV/JSON 出力が動作し、インポートで復元できる
  - 派生指標が保存され、Viewer へ反映される

### 11.4 フェーズ 3: UX / デザイン刷新
- SVG ベース UI の導入
- レイヤー化表示とアニメーション実装
- セッション一覧と詳細閲覧機能の拡張
- 完了条件:
  - ROLL/PITCH の新 UI が動作し、レイヤーアニメーションが動く
  - 操作性の高い記録/解析 UI が提供される

### 11.5 フェーズ 4: 解析と拡張
- 船種モデル、波・風影響解析の実装
- 高度な派生データと比較表示の追加
- 将来のクラウド同期設計の準備
- 完了条件:
  - 船種ごとに係数を切り替えられる
  - 波・風影響を分析する指標を Viewer で表示できる
  - クラウド同期の仕様設計が完了している

## 12. Git コミット単位

### 12.1 推奨コミット単位
- `chore: init project structure`
- `feat(storage): define indexeddb schema and versioning`
- `feat(app): add session and trackpoint model`
- `feat(viewer): add session listing and loading`
- `feat(storage): implement json/csv import export`
- `feat(physics): add boat model and derived metrics`
- `feat(ui): add svg meter layer architecture`
- `refactor: separate app/viewer/storage/physics modules`
- `docs: update design and data flow documentation`

### 12.2 追加の小分け作業
- `storage: add migrate onupgradeneeded`
- `app: add recorder buffer and save trigger`
- `viewer: add playback slider sync`
- `physics: add estimatedRoll/lateralG/rollResidual fields`
- `ui: add responsive layout for mobile`

## 13. Phase1 で最初に実装する具体的な内容

1. フォルダ構成 `src/` を確立し、既存ファイルを移行しやすい土台を作る
2. `storage/indexeddb.js` で DB の接続とバージョン管理を実装
3. `storage/schema.js` で `Session` / `TrackPoint` / `DerivedData` を定義
4. `app/session.js` と `app/recorder.js` で記録バッファと保存フローを設計
5. `viewer/list.js` と `viewer/main.js` で保存済みセッション一覧・読み込み基盤を作る
6. `analytics.js` で保存時に派生データを計算し、`Session.stats` に格納する
7. `export.js` / `import.js` で JSON バックアップと CSV エクスポート/インポートの基礎を整える
8. `ui/theme.js` と `ui/layout.js` で近未来デザイン基盤の共通テーマを定義する

---

BoatMeter v2 は単なる傾斜計から、船体姿勢可視化・航跡解析・物理推定へ拡張可能な研究プラットフォームを目指します。Phase0 では設計を固め、Phase1 で実装の土台を着実に構築してください。
