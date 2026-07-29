# USDL v4 Implementation Profile — usi-yosakoi

## この文書の役割

この文書は、現在の実装・デザイン・データ運用に関する技術的な前提をまとめたものです。サイトの事業前提は [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)、Codexの作業手順は [CODEX_WORKFLOW.md](./CODEX_WORKFLOW.md) を参照してください。

## Position

`usi-yosakoi` は `yosakoi.united-studio.com` 用の独立サイトであり、別ブランドではありません。USDL v4の思想・構成判断・役割契約を土台としながら、よさこい領域に必要な「制御された熱量」をproject-specific expressionとして扱います。

USDL Coreのファイル、Core Component、Core Pattern、Core Tokenは変更・追加しません。

## Technical foundation

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercelでのホスティングを想定
- CMSや外部データベースを前提とせず、静的データを中心に構成

依存関係、CMS、外部サービスは、必要性と運用責任を確認せず追加しません。

## Dominant Moment

トップページのDominant MomentはHEROです。

- 最初に「よさこい演舞のテーマと熱量を、記憶に残る音楽へ」という提供価値を示す
- Formation、Surge、Pulseを、隊列・音の展開・鼓動に由来する現象として使う
- HEROとFinaleにproject-specificなCanvas Kineticsを使う
- Archiveでは探索と操作を主役にし、Canvasを使わない

Archiveは探索と操作を主役にし、演出を抑えます。

## Experience composition

トップページは次の順序で構成します。

1. Statement — HERO
2. Narrative — INTRO / 制作の特徴 / 制作プロセス
3. Work — Selected Works
4. Entry — Archive導線
5. Invitation — FAQ / Inquiry

Archiveは `Entry → Work → Invitation` とし、検索、条件、件数、作品カードの順序をモバイルでも維持します。

## Yosakoi Extension phenomena

以下はすべてこのプロジェクト内だけで使う表現です。

| Phenomenon | 意味 | 現在の用途 |
| --- | --- | --- |
| Formation | 隊列・集団の秩序 | HEROの線群、カードパターン |
| Surge | 押し寄せる熱量 | HEROの斜行する色面 |
| Pulse | 太鼓・リズムの鼓動 | HEROの同心円、制作プロセス |
| Flow | 演舞構成の流れ | カードの曲線的レイヤー |
| Burst | 見せ場の爆発 | カードのアクセント面 |
| Trace | 演舞後の余韻 | カードの細い軌跡 |
| Festival Layer | 衣装・光・会場感の重なり | 複数の色面と薄い粒子 |

Callは音声を自動再生せず、将来必要になった場合もユーザー操作を起点とします。

## Kinetics contract

- KineticsはHEROとFinaleだけで使用する
- 2D Canvasと `requestAnimationFrame` で実装する
- 外部アニメーションライブラリ、Three.js、WebGLは使わない
- `pointer-events: none` とし、本文、CTA、Headerの操作を妨げない
- `prefers-reduced-motion` ではアニメーションを停止し、静止したFormationを残す
- Intersection Observerで画面外の描画を停止する
- `visibilitychange` で非表示タブの描画を停止する
- Mobileでは粒子密度と描画負荷を抑える
- React stateで毎フレーム再レンダリングしない

## Archive data contract

- 作品データの正本は `data/yosakoi-works.ts`
- チームIDと正式表示名の台帳は `data/yosakoi-teams.ts`
- `status !== "draft"` の作品だけを公開対象にする
- 新規作品の受付には [NEW_YOSAKOI_WORK_TEMPLATE.md](./NEW_YOSAKOI_WORK_TEMPLATE.md) を使う
- 詳細な入力規則は [ARCHIVE_DATA_GUIDE.md](./ARCHIVE_DATA_GUIDE.md) に集約する
- Archiveデータを変更したら、必ず `npm run validate:archive` を実行する
- YouTube URL全文ではなく、11文字の `youtubeId` だけを保存する

## Thumbnail contract

- 画像なしで成立する自動生成サムネイルを標準とする
- 色は年度から決め、同じ年は同じベースカラーを使う
- パターンはチームから決め、同じチームは同じ視覚パターンを使う
- 複数年度作品の色は、表示上の最新年度を基準にできる
- 年度、チーム名、作品名の可読性を装飾より優先する
- 写真やチームロゴは必須にしない
- 将来的に任意のロゴ画像へ対応できる余地は残すが、標準運用は自動生成とする

## Performance contract

- Archiveは画像なしのCSSサムネイルを標準とする
- YouTube iframeは初期HTMLに含めない
- ArchiveのYouTube iframeはユーザーが再生を選んだ時だけ生成する
- Archiveで同時に存在するiframeは最大1件とする
- 検索やフィルターにより再生中の作品が一覧から外れたらiframeを破棄する
- YouTube埋め込みには `youtube-nocookie.com` を使う
- YouTubeを外部で開く導線も残す
- ArchiveのCanvasは0枚を維持する
- 初期表示件数はPC 24件、Mobile 12件
- masonryや重いアニメーションライブラリを使わない

## Accessibility contract

- CTAはリンク、状態変更はボタンとして実装する
- フィルターはlabelとnative form controlを使う
- 結果件数を`aria-live`で通知する
- 色だけで状態を表現しない
- iframeに作品名を含むtitleを付ける
- キーボードfocusを常に可視化する
- reduced motionで演出を停止する

## Contact contract

- Contactは、本気で楽曲制作を検討しているチーム向けとする
- 基本料金表を掲載しない
- 無料見積もりを主要訴求にしない
- 制作時期・内容を確認し、調整可能な場合に相談を進める
- フォーム送信基盤として外部サービスを導入する場合は、実装前に確認する

## Metadata release gate

初期実装はルートlayoutで`noindex, nofollow`にします。公開時は内容・OGP・canonical・サンプル表記・全件データを確認した後にrobotsを切り替えます。

公開前に、旧 `/yosakoi-matsuri` から新トップへの301 redirectを既存サイト側で別途計画します。このリポジトリではまだ設定しません。
