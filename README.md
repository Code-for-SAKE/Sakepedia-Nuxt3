# Sakepedia-Nuxt3
みんなでつくる日本酒オープンデータSakepediaのNuxt3版

# 環境
Docker
Nuxt3.11.1
yarn

# setting

## Firebase

- new Project
  - プロジェクト名:sakepedia-nuxt3
  - Spark
  - Firestore Database
    - default
  - Authentication
    - Googleを有効にする
  - プロジェクトにウェブアプリを追加

## .env

Firebaseのウェブアプリの`SDK の設定と構成`を参照

```.env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGEING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

# build

## docker
- nuxt
  - Nuxt3が動作するコンテナ
- firebase
  - firebaseエミュレータが動作するコンテナ

```bash
docker-compose up -d
docker compose run --rm firebase firebase login --no-localhost
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
yarn dev
```
### ブラウザ
#### Sakepedia
http://localhost:3000/

#### Firebaseエミュレータ
http://localhost:4000/
