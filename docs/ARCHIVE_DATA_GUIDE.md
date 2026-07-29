# よさこい作品アーカイブ データ運用ガイド

このガイドは、`data/yosakoi-works.ts` に新しい作品を安全に追加するためのルールです。CMSや外部データベースは使わず、リポジトリ内の静的データを正として運用します。

## 新規作品の追加手順

1. 新しいチームの場合は、先に `data/yosakoi-teams.ts` へチームを追加します。
2. `data/yosakoi-works.ts` の `allYosakoiWorks` 先頭付近へ作品を追加します。
3. `npm run validate:archive` を実行します。
4. エラーをすべて修正し、警告内容を確認します。
5. `npm run typecheck`、`npm run lint`、`npm run build` を実行します。
6. Archiveの件数、検索、年度・チームフィルターを確認してからcommitします。

```bash
npm run validate:archive
npm run typecheck
npm run lint
npm run build
```

`status: "draft"` の作品は、`yosakoiWorks` の公開用配列から自動的に除外されます。Archive、検索候補、年度・チームフィルター、件数、トップページのSelected Worksには表示されません。

## 必須項目

新規のpublished作品では次の項目を必須とします。

- `id`
- `years`
- `teamId`
- `teamName`
- `workTitle`
- `youtubeId`
- `status`（省略可能。省略時はpublished）

既存の移行作品には曲名未掲載のデータが4件あります。新規作品でタイトルが未定・不明の場合は、勝手に仮題を作らず `workTitle` を省略し、理由を `notes` に記録してください。検証では警告になります。

## 任意項目

- `featured`
- `location`
- `notes`
- `thumbnailVariant`
- `accentColor`
- `thumbnailImage`
- `order`
- `status`

画像は必須ではありません。`thumbnailImage` がなければ、年度・チーム名・曲名から自動サムネイルが生成されます。

## id命名ルール

移行済みデータの `work-120914` のようなIDは、旧WordPressレコードとの対応を維持するため変更しません。

2026年以降の新規作品は、次の形式を使用します。

```text
YYYY-team-id-short-title
```

例：

```text
2026-takamatsuyosakoiren-new-work
2026-kokushi-001
```

- 半角小文字英数字とハイフンだけを使う
- 日本語タイトルを無理にローマ字化しない
- 適切な英語slugが作れない場合は、チーム内連番を使う
- 一度公開したIDは、曲名やチーム名が変わっても変更しない
- 重複は禁止

## teamIdとチーム名

`teamId` と正式表示名は `data/yosakoi-teams.ts` で一元管理します。

作品データにも `teamName` を保持していますが、これは移行データとの互換性を維持するためです。`teamId` がチームの変わらない識別子、`teamName` が画面に表示する名前です。表示名とは別にIDを持つことで、表記修正や改名があっても過去作品を同じチームとして扱えます。

検証スクリプトは、未登録teamIdとteamNameの不一致をエラーにします。

### 既存チームに作品を追加する場合

1. `data/yosakoi-teams.ts` で対象チームを検索します。
2. 台帳に記載された `id` と `name` をそのまま作品の `teamId` と `teamName` にコピーします。
3. 表記を短縮したり、空白・大学名・記号を変更したりしないでください。

似た名前があっても、表記違いだけで新しいteamIdを作らないでください。同じ団体か判断できない場合は、追加前に確認します。

### 新規チームの初作品を追加する場合

必ず次の順番で追加します。

1. `data/yosakoi-teams.ts` にチームを登録
2. `data/yosakoi-works.ts` に初作品を登録

チーム台帳：

```ts
// data/yosakoi-teams.ts
{
  id: "seiranren",
  name: "青嵐連",
}
```

作品：

```ts
// data/yosakoi-works.ts
{
  id: "2026-seiranren-new-work",
  years: [2026],
  teamId: "seiranren",
  teamName: "青嵐連",
  workTitle: "新作タイトル",
  youtubeId: "XXXXXXXXXXX",
  status: "published",
}
```

作品だけを先に追加すると、`npm run validate:archive` は未登録teamIdとして停止します。

```text
ERROR: Unknown teamId "seiranren" in work "2026-seiranren-new-work".
If this is a new team, add it to data/yosakoi-teams.ts first.
```

### teamIdの命名ルール

- 半角小文字英数字とハイフンだけを使う
- 短く、入力しやすく、長期間変わらないslugにする
- 一度決めたteamIdは基本的に変更しない
- 表示名が変わっても、過去作品との連続性を保つためteamIdは維持する
- 表記違い、スペース違い、旧字体・新字体違いで別teamIdを作らない
- 本当に別団体の場合だけ新しいteamIdを作る
- 日本語名を無理に完全ローマ字化しなくてよい
- 既存IDとの重複を避ける

### teamName表記を変更する場合

`teamName` はチーム台帳と作品データで完全一致する必要があります。末尾の空白、大学名の省略、全角・半角記号の違いも不一致として検出されます。

```text
ERROR: teamName mismatch for teamId "seiranren".
work teamName: "青嵐連 "
registry name: "青嵐連"
Update data/yosakoi-works.ts or data/yosakoi-teams.ts.
```

単なる誤字修正の場合は、台帳と同じteamIdを持つ全作品の `teamName` を同時に修正してください。作品1件だけ表記を変えると検証エラーになります。

### チームが改名された場合

改名後も原則として同じteamIdを使い続けます。

1. `data/yosakoi-teams.ts` の `name` を新しい正式表示名へ変更
2. 同じteamIdを持つ全作品の `teamName` を新しい表示名へ変更
3. `npm run validate:archive` で不一致がないことを確認

現在は `aliases` をデータ型や検索UIへ実装していません。旧名称を検索対象として残す必要が生じた場合は、将来次のような台帳拡張を検討します。

```ts
{
  id: "example-ren",
  name: "新しい表示名",
  aliases: ["旧チーム名"],
}
```

本当に別団体として再編された場合だけ、新しいteamIdを作ります。改名か別団体か不明な場合は、推測でIDを分けず確認してください。

### 将来のデータ構造

現在は移行データとの互換性のため、作品データにも `teamName` を保持しています。将来的にはteamIdからチーム台帳の表示名を参照し、作品側の `teamName` を省略する構成へ移行する可能性があります。

現時点では互換性を優先し、teamIdとteamNameの両方を作品データに保持します。

## YouTube ID

データにはURL全文ではなく、11文字の動画IDだけを保存します。

```text
https://www.youtube.com/watch?v=NpEgk5tcMRU
                                └─ NpEgk5tcMRU

https://youtu.be/NpEgk5tcMRU
                 └─ NpEgk5tcMRU
```

`lib/yosakoi.ts` の `extractYoutubeId()` は、通常URL、短縮URL、Shorts URL、embed URLからIDを抽出できます。URL全文を `youtubeId` に貼ると検証エラーになります。

## 複数年度

年度は古い順に、重複なく、連続する年度を入力します。

```ts
years: [2026, 2027]
```

`[2027, 2026]`、`[2026, 2026]`、`[2026, 2028]` はエラーです。入力可能な年度は2008年から実行時点の翌年までです。

## draft / published

- `status` 省略時はpublished
- publishedは原則として `workTitle` と `youtubeId` が必要
- publishedで `youtubeId` がない場合はエラー
- draftは `youtubeId` なしでも可
- draftに `featured: true` は設定できない
- draftは公開用の `yosakoiWorks` と `featuredWorks` に含まれない

公開時は `status: "draft"` を `"published"` に変えるか、`status` 自体を削除します。

## featured

`featured` はトップページで紹介する代表作だけに設定します。

- `featured: true` はpublished作品だけに設定できる
- 最大6件
- 追加する場合は、既存featuredとの入れ替えを検討する
- 新規作品だからという理由だけで自動的にfeaturedにしない

## サムネイル指定

`thumbnailVariant` の許可値：

```text
formation
surge
pulse
flow
```

`accentColor` は `#E66B42` のような6桁HEXカラーだけを使用します。どちらも通常は省略し、自動生成結果を優先してください。

## order

同じ最新年度内で表示順を明示したい場合だけ、0以上の整数を指定します。同じ年度内で同じ `order` を重複させないでください。通常は配列順と年度の自動ソートに任せます。

## サンプルデータ

published作品：

```ts
{
  id: "2026-sample-team-new-work",
  years: [2026],
  teamId: "sample-team",
  teamName: "サンプル連",
  workTitle: "新しい作品名",
  youtubeId: "XXXXXXXXXXX",
  status: "published",
}
```

複数年度：

```ts
{
  id: "2026-sample-team-two-year-work",
  years: [2026, 2027],
  teamId: "sample-team",
  teamName: "サンプル連",
  workTitle: "二年またぎの作品",
  youtubeId: "XXXXXXXXXXX",
  status: "published",
}
```

draft：

```ts
{
  id: "2026-sample-team-draft",
  years: [2026],
  teamId: "sample-team",
  teamName: "サンプル連",
  workTitle: "仮タイトル",
  status: "draft",
}
```

これらのサンプルを実際に追加する場合は、先に `sample-team` をチーム台帳へ登録し、`XXXXXXXXXXX` を実在する11文字のYouTube IDへ置き換えてください。

## エラーと警告

エラーはcommit前に必ず修正します。ID重複、年度範囲外、チーム不一致、YouTube ID不正、publishedのYouTube欠損、draftのfeatured、featured上限超過などが対象です。

警告は処理を失敗させませんが、内容を確認します。現在は `workTitle` 未掲載を警告として報告します。

## よくあるミス

- YouTube URL全文を `youtubeId` に貼る
- チーム名の大学名、空白、記号を省略する
- 新しいteamIdをチーム台帳へ追加し忘れる
- 複数年度を新しい順で書く
- 投稿日や動画公開年を演舞年度として入力する
- draftに `featured: true` を付ける
- featuredを6件より多くする
- 同じ年度で `order` を重複させる
- IDを公開後に変更する
