# usi-yosakoi

`yosakoi.united-studio.com` 用の、UNITED STUDIOよさこい演舞楽曲制作サイトです。

この初期実装は、制作案内のトップページと、よさこい作品に特化した独立アーカイブで構成しています。作品カードは画像を必須にせず、年度・チーム・作品IDから安定したグラフィックを生成します。

## Routes

- `/` — よさこい演舞楽曲制作
- `/archive` — 制作実績・作品アーカイブ

## Development

```bash
npm install
npm run dev
```

検証:

```bash
npm run typecheck
npm run lint
npm run build
```

## Data

作品データは `data/yosakoi-works.ts` に集約しています。現在はUI確認用の8件のみで、本番104件の移行は次フェーズです。

`thumbnailImage` は任意です。未指定時は `teamId`、`years`、`id` の安定hashと、事前に選定したパレットからサムネイルを生成します。

## Release status

- 全ページ `noindex, nofollow`
- 本番ドメイン未接続
- 旧 `/yosakoi-matsuri` のredirect未設定
- 既存 `united-studio.com` 未変更

USDL v4の適用範囲は [`docs/IMPLEMENTATION_PROFILE.md`](docs/IMPLEMENTATION_PROFILE.md) を参照してください。
