# USDL v4 Implementation Profile — usi-yosakoi

## Position

`usi-yosakoi` はUNITED STUDIO系列の独立サイトであり、別ブランドではありません。USDL v4の思想・構成判断・役割契約を土台としながら、よさこい領域に必要な「制御された熱量」をproject-specific expressionとして扱います。

USDL Coreのファイル、Core Component、Core Pattern、Core Tokenは変更・追加しません。

## Dominant Moment

トップページのDominant MomentはHEROです。

- 最初に「よさこい演舞のテーマと熱量を、記憶に残る音楽へ」という提供価値を示す
- Formation、Surge、Pulseを、隊列・音の展開・鼓動に由来する現象として使う
- 初期モーションは短く収束し、常時動き続けない
- `prefers-reduced-motion` では静止状態にする

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

## Performance contract

- Archiveは画像なしのCSSサムネイルを標準とする
- YouTube iframeは初期HTMLに含めない
- Selected Worksでユーザーが選んだ時だけ1件生成する
- ArchiveはYouTube外部リンクを主動線とする
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

## Metadata release gate

初期実装はルートlayoutで`noindex, nofollow`にします。公開時は内容・OGP・canonical・サンプル表記・全件データを確認した後にrobotsを切り替えます。

公開前に、旧 `/yosakoi-matsuri` から新トップへの301 redirectを既存サイト側で別途計画します。このリポジトリではまだ設定しません。
