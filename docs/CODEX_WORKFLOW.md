# Codex Workflow — usi-yosakoi

## この文書の役割

この文書は、Codexが `usi-yosakoi` を変更するときの基本手順と禁止事項を定めます。

作業前に、最低限次の文書を確認してください。

1. [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
2. [IMPLEMENTATION_PROFILE.md](./IMPLEMENTATION_PROFILE.md)
3. 作業対象に対応する詳細ガイド

Archiveデータを扱う場合は [ARCHIVE_DATA_GUIDE.md](./ARCHIVE_DATA_GUIDE.md)、新規作品を追加する場合は [NEW_YOSAKOI_WORK_TEMPLATE.md](./NEW_YOSAKOI_WORK_TEMPLATE.md) も読みます。

## 作業開始前

- ユーザーが許可した変更範囲を明確にする
- 現在の `git status` と関連ファイルを確認する
- 既存の未コミット変更をユーザーの作業として尊重する
- 指示されていないページやコンポーネントへ変更を広げない
- HERO、Kinetics、Archive、Contactを別の影響範囲として扱う

修正に必要な範囲がユーザーの指示を越える場合は、勝手に拡張せず確認します。

## 領域別の注意

### HERO / Kinetics

- コピー、CTA、Headerを同時に変更しない
- ArchiveへCanvasやKineticsを持ち込まない
- reduced-motion、Intersection Observer、`visibilitychange`、Mobile負荷を維持する
- 外部アニメーションライブラリ、Three.js、WebGLを勝手に追加しない

### Archive

- データ、探索UI、カード表示、YouTube再生を区別して変更する
- 初期iframe 0、同時iframe最大1、Archive Canvas 0を維持する
- 作品データの内容を、表示調整の都合で勝手に書き換えない
- Archiveデータを変更した場合は、必ず `npm run validate:archive` を実行する

### Contact

- 料金表、無料見積もり、不特定多数への強い問い合わせ訴求を勝手に追加しない
- 問い合わせフォームの送信基盤や外部サービスは、追加前にユーザーへ確認する

## 変更してはいけない項目

明示指示がない限り、次を変更しません。

- metadata
- `noindex` / robots
- OGP
- canonical
- 旧 `/yosakoi-matsuri` のリダイレクト
- CMSや外部サービス
- npm依存関係
- USDL Core

## 検証

変更内容に応じて、次を実行します。

```bash
# Archiveデータを変更した場合は必須
npm run validate:archive

# すべての実装変更で必須
npm run build

# 利用可能な場合
npm run typecheck
npm run lint
git diff --check
```

ドキュメントだけを変更した場合は、最低限 `git diff --check` と `git status` を確認します。UI変更では、対象ページ、Mobile、キーボード操作、コンソールエラーも変更内容に応じて確認します。

## Git運用

- commitとpushは、ユーザーから明示指示があるまで行わない
- ユーザーが指定したコミット単位とメッセージを尊重する
- 無関係な既存差分をstageしない
- destructiveなGit操作で既存変更を消さない

## 完了報告

作業後は次を報告します。

- 実施内容
- 変更ファイル
- 実行した検証と結果
- 未解決事項やリスク
- `git status`

commitやpushを行った場合は、加えてcommit hash、push先ブランチ、デプロイ状況を報告します。
