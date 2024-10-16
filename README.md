# Sakepedia-Nuxt3
みんなでつくる日本酒オープンデータSakepediaのNuxt3版

[Readme in english](./README.en.md)

# 環境
- Docker
- node v22.9.0
- yarn 1.22.22
- Nuxt3.11.1

# setting

## Firebase

- new Project
  - プロジェクト名:任意 sakepedia-nuxt3
  - Spark
  - Firestore Database
    - default
  - Authentication
    - Googleを有効にする
  - プロジェクトにウェブアプリを追加

## .env

Firebaseのウェブアプリの`SDK の設定と構成`を参照

app/.env
```.env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGEING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## .firebaserc

.firebaserc
```json
{
  "projects": {
    "default": "<FirebaseのプロジェクトID>"
  }
}
```

# build

## docker
- nuxt
  - Nuxt3が動作するコンテナ
- firebase
  - firebaseエミュレータが動作するコンテナ

```bash
docker-compose up -d
docker-compose run --rm firebase firebase login --no-localhost
```
- エラーレポートの収集は任意
- 出てきたURLにアクセス
- セッションIDを確認
- 出てきたコードをCLIに貼り付け
- `Success! Logged in as xxxx`が出てきたらログインOK

# run

```bash
docker-compose exec nuxt bash
```

### nuxtコンテナ
```bash
yarn install
yarn dev
```
### ブラウザ
#### Sakepedia
http://localhost:3000/

#### Firebaseエミュレータ
http://localhost:4000/


# deploy　
### nuxtコンテナ
```bash
yarn build --preset=firebase
firebase login --no-localhost
npx firebase-tools deploy --project sakepedia-nuxt3
```

# Linter

ESLint を使用しています

## VSCode の設定

1. ESLint 用の拡張機能を追加します
1. `.vscode/settings.json` に以下の項目を追記します

```json
"eslint.experimental.useFlatConfig": true,
"eslint.workingDirectories": [
    "./app"
]
```

# Formatter

Prettier を使用しています

## VSCode の設定

1. Prettier 用の拡張機能を追加します

# データ インポート/エクスポート

## ローカルemulatorのエクスポート

```
firebase emulators:export /opt/data/bkp
```

# firestore インポート
## firestoreでstorageにエクスポート
## gcloudでローカルにダウンロード

```
rm -rf /opt/data/bkp
gcloud storage cp -r "gs://sakepedia-data/2024-06-12T10:56:22_57740" /opt/data
mv /opt/data/2024-06-12T10:56:22_57740 /opt/data/bkp
```

# MacM1の場合、インストールが失敗します
コンテナ内のインストール `yarn install` ステップで、`gyp` というエラーメッセージが表示されてインストールに失敗する。
この問題を解決するには、コンテナを作成する前に `yarn remove firebase-admin` を使用して `firebase-admin` 依存関係を削除する必要がある。
まだ行けない場合、`Dockerfile.m5`を`Dockerfile`に上書きしてからdockerのイメージをbuildをしたらいける（かも）。

# Nuxt2版からのデータ移行

## データは以下
- brands
- breweries
- brewery_year_datas # 昔の形
- breweryyeardatas # 今の形
- comments
- sakes
- users # 移行しない

## Nuxt2版のサーバでmongodb内のデータをエクスポート

```
mongoexport -d Sakepedia -c breweries --out breweries.json
mongoexport -d Sakepedia -c brands --out brands.json
mongoexport -d Sakepedia -c sakes --out sakes.json
mongoexport -d Sakepedia -c comments --out comments.json
mongoexport -d Sakepedia -c brewery_year_datas --out brewery_year_datas.json
mongoexport -d Sakepedia -c breweryyeardatas --out breweryyeardatas.json
```

## nuxtコンテナでシミュレータにインポート

```
yarn dev
```

http://localhost:3000/dumper
以下の順でボタン押下してインポート
コンソールログにdoneが出るまで待つ。

- 酒蔵
- 銘柄
- 日本酒
- 醸造データ
- 投稿

## firebaseコンテナでエミュレータのデータをエクスポート

```
firebase emulators:export /opt/data/bkp
```

## firestoreのデータをクラウドにアップ
gcloud storage cp -r  /opt/data "gs://sakepedia-data/2024-10-01"

## クラウドにアップしたデータをfirestoreにインポート
Firebaseプロジェクト
Firestore Database
Google Cloudのその他の機能
インポート/エクスポート を選択

インポート
アップロードしたフォルダ内のoverall_export_metadataを参照
sakepedia-data/2024-10-01/firestore_export/firestore_export.overall_export_metadata

## firebaseコンテナでエミュレータのエクスポートデータをfirestorageにアップロード

```
cd /opt/data
bash upload.sh
```
