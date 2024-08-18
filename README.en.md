# Sakepedia-Nuxt3
The Nuxt3 version of Sakepedia, an open data project for Japanese sake created by everyone.

# Environment Requirement 
Docker
Nuxt3.11.1
yarn

# setting

## Firebase

- new Project
  - Project Name: as you like e.g. sakepedia-nuxt3
  - Spark
  - Firestore Database
    - default
  - Authentication
    - Google enabled
  - Add a web app to your project

## .env

Please refer to the `SDK setup and configuration` for the Firebase web app

front/.env
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
  - Use Nuxt3 base container
- firebase
  - Use firebase emulator base container

```bash
docker-compose up -d
docker-compose run --rm firebase firebase login --no-localhost
```
- Collecting error reports is optional.
- URL are shown for access.
- Review the session ID. 
- Paste the code that appears into the CLI.
- If it is shown "Success! Logged in as xxxx", the login is successful.

# run

```bash
docker-compose exec nuxt bash
```

### nuxt container
```bash
yarn install
yarn dev
```
### Browsing 
#### Sakepedia
http://localhost:3000/

#### Firebaseエミュレータ
http://localhost:4000/


# deploy　
### nuxt container
```bash
yarn build --preset=firebase
npx firebase-tools deploy --project sakepedia-nuxt3
```

# Linter

ESLint is in use.

## VSCode setting

1. Add ESLint extension into you VSCode 
1. Add below item into your `.vscode/settings.json`

```json
"eslint.experimental.useFlatConfig": true,
"eslint.workingDirectories": [
    "./app"
]
```

# Formatter

Prettier is in use

## VSCode setting

1. Add Prettier extension into your VSCode

# Data import / export

## Export data to your local simulator

```
rm -rf /opt/data/bkp
firebase emulators:export /opt/data/bkp
```

# firestore importation
## Use firestore to storage the exported data
## Download locally using Google Cloud

```
rm -rf /opt/data/bkp
gcloud storage cp -r "gs://sakepedia-data/2024-06-12T10:56:22_57740" /opt/data
mv /opt/data/2024-06-12T10:56:22_57740 /opt/data/bkp
```
