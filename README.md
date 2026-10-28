# USI よさこい演舞音楽制作サイト

2026年10月28日時点の公開候補ソースです。作品を入口に、チームとの歩み、制作姿勢、相談へつなげる構成です。実公開の切り替えは行っていません。

## ページ

- `/`：回転するチームマーク、全107作品の検索・年度/チームフィルター、國士舞双の映像と歩み、制作姿勢、相談。
- `/archive`：旧リンク用。条件を引き継いで `/?year=…&team=…&q=…#works` へ案内。
- `/process`：制作工程、Mixing/Mastering、スタジオリンク、FAQ。
- `/contact`：既存の相談フォーム。
- `/top-preview`：同じ最新トップの確認用。noindex。
- `/preview` 以下：過去の比較案。noindex。公開ナビゲーションには含めません。

## 起動・検証

Node.js 22.13以上。依存関係はpackage-lock.jsonで固定しています。

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3100
npm run validate:archive
npm run typecheck
npm run lint
npm run build
npm run start -- --hostname 127.0.0.1 --port 3101
```

buildは検証済みのWebpackを明示使用します。公開にはNext.jsサーバーが必要で、静的HTMLだけの配置では問い合わせAPIが動きません。

## データとマーク

正本は `data/yosakoi-works.ts` と `data/yosakoi-teams.ts`。公開107作品、28チーム、2008〜2026年です。公開用配列はdraftを除外します。マークの対応表は `data/team-marks.json`、SVGは `public/team-marks/`。

- 作品追加後、件数・年度・チームフィルター・回転カードは再生成時に自動更新。
- 回転棚は、公開映像と登録済みマークがあるチームの最新映像。通算制作数順。
- チームフィルターも通算制作数順で固定。候補の件数は現在の年度・検索条件に応じて変化。
- 國士舞双の紹介4作品と、2012/2026年の節目は編集で選んだ固定作品。
- マークの字形・光学サイズ補正はSVG内部に確定済み。重ねて補正しません。

## 問い合わせ設定

既存のResend送信処理を維持しています。サーバー側だけに次の設定が必要です。実値は配布物に含めません。

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`：送信元として認証済みのアドレス
- `CONTACT_TO_EMAIL`：未指定時は既存のinfo宛先

`.env.example` は入力項目の見本です。認証情報をNEXT_PUBLIC_変数やGitへ入れません。

## 公開設定

受領ソースの設定を維持：正式ページはindex/follow、確認ページはnoindex。本番canonicalは `https://yosakoi.united-studio.com`。既存GA4は本番ホスト・本番環境だけを対象にする既存方針です。計測方針スクリプトはRootLayoutに配置し、警告を解消しました。

旧 `/yosakoi-matsuri` の切り替えは対象外。Vercelへの送信・本番昇格・Gitへのcommit/pushは未実施です。

公開直前の状態と残る作業は [RELEASE_READY.md](RELEASE_READY.md) を参照してください。古いプロジェクト文書の「8件のみ」「全ページnoindex」「独立アーカイブ」という記述より、この現行仕様を優先します。
