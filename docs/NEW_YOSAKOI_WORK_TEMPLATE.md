# よさこい新規作品 追加テンプレート

年に一度ほど新しい作品を追加するときは、下の「ユーザー記入欄」だけを記入し、「Codexへの依頼文」と一緒にCodexへ渡してください。`teamId`、作品ID、YouTube IDをユーザーが調べる必要はありません。

## ユーザー記入欄

```text
チーム名：
年度：
作品名：
YouTube URL：

任意：
複数年度：
featured：
メモ：
```

### 記入時の補足

- `年度` は主となる演舞年度を西暦で記入します。
- 複数年度にまたがる作品は、`複数年度` に `2026, 2027` のように古い順で記入します。
- `featured` はトップページのSelected Worksへ掲載したい場合だけ `希望` と記入します。最終的な設定は既存のfeatured件数を確認して判断します。
- 作品名が未定または不明な場合は、その旨を `メモ` に記入します。推測した仮題は作りません。
- YouTubeはURL全文を記入して構いません。データにはCodexが抽出した11文字の `youtubeId` だけを保存します。

## 記入例

```text
チーム名：青嵐連
年度：2026
作品名：新作タイトル
YouTube URL：https://www.youtube.com/watch?v=XXXXXXXXXXX

任意：
複数年度：
featured：希望
メモ：2026年の新規チームです。
```

複数年度の場合：

```text
チーム名：高松よさこい連
年度：2026
作品名：二年またぎの作品
YouTube URL：https://youtu.be/XXXXXXXXXXX

任意：
複数年度：2026, 2027
featured：
メモ：
```

## Codexへの依頼文

次の依頼文と、記入済みの「ユーザー記入欄」を一緒に渡してください。

```text
よさこいアーカイブへ、下記の新規作品を追加してください。

最初に data/yosakoi-teams.ts を確認し、記入されたチーム名に対応する既存teamIdを探してください。ユーザーにteamIdの調査を求めないでください。

既存チームが見つかった場合：
- 台帳のteamIdと正式なteamNameを使用してください。
- 表記違いだけを理由に新しいteamIdを作らないでください。

新規チームの場合：
- 短く安定したkebab-caseのteamIdを提案してください。
- data/yosakoi-teams.ts にチームを追加してから、data/yosakoi-works.ts に作品を追加してください。

同一チームか判断しにくい近い名前、表記揺れ、旧名と思われる名前が台帳にある場合は、誤登録を防ぐため、ファイルを変更する前にユーザーへ確認してください。

YouTube URLから11文字のyoutubeIdを抽出し、URL全文ではなくyoutubeIdだけを作品データへ保存してください。年度はyears配列にし、複数年度が指定されている場合は古い順で保持してください。

既存ルールに従って、重複しない安定した作品idを作成してください。作品は data/yosakoi-works.ts の allYosakoiWorks に追加してください。featuredが希望されている場合は、既存件数と上限を確認し、上限を超える場合は勝手に入れ替えず報告してください。

追加後に以下を実行してください。

npm run validate:archive
npm run build

検証結果、追加したteamId、作品id、抽出したyoutubeId、変更ファイル、git statusを報告してください。

commit・pushは行わないでください。
Archive UI、トップページ、metadata、OGP、noindex、YouTube遅延読み込み、package.json scriptsは変更しないでください。
```

## Codexが行う処理

### 既存チームの場合

1. `data/yosakoi-teams.ts` から表示名と近い候補を検索します。
2. 一致する台帳の `teamId` と正式な `name` を採用します。
3. YouTube URLから `youtubeId` を抽出します。
4. 年度、作品名、任意項目を正規化して `data/yosakoi-works.ts` へ追加します。
5. データ検証とProduction buildを実行します。

### 新規チームの場合

1. 既存台帳に同一・類似チームがないことを確認します。
2. 既存IDと重複しない、変更しにくい `teamId` を提案します。
3. `data/yosakoi-teams.ts` に新規チームを登録します。
4. その `teamId` を使って `data/yosakoi-works.ts` に作品を追加します。
5. データ検証とProduction buildを実行します。

近いチーム名があり、同一団体か別団体かをリポジトリ内の情報だけで確定できない場合は、Codexは推測で登録せずユーザーへ確認します。

## 完了条件

- `teamId` と `teamName` がチーム台帳と一致している
- 作品IDが既存データと重複していない
- `years` が正しい
- YouTube URLから有効な `youtubeId` が保存されている
- `npm run validate:archive` が成功している
- `npm run build` が成功している
- commit・pushが行われていない
