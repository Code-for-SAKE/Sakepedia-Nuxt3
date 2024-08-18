# Sakepedia-Nuxt3
みんなでつくる日本酒オープンデータSakepediaのNuxt3版

[Readme in english](./README.en.md)

# 環境
Docker
Nuxt3.11.1
yarn

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
rm -rf /opt/data/bkp
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
