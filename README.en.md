# Sakepedia-Nuxt3
The Nuxt3 version of Sakepedia, an open data project for Japanese sake created by everyone.

[Readme in Japanese](./README.md)

# Environment Requirement 

- Docker
- Nuxt3.11.1
- yarn


# setting

Please follow steps below one by one

## 0. Clone project

```
git clone git@github.com:Code-for-SAKE/Sakepedia-Nuxt3.git
```

## 1. Firebase

Go to Firebase website, create new project (It's free.)
Currently, the url is https://console.firebase.google.com/

- new Project
  - Project Name: as you like e.g. sakepedia-nuxt3
  - Spark
  - Firestore Database
    - default
  - Authentication
    - Google enabled
  - Add a web app to your project


## 2. Create environment setting for Firebase

After project created, get firebase setup info here:
- Project overview -> press `</>` website icon
- Fill the project name, could be the same as `sakepedia-nuxt3`, register
- Get info under const (do not leak these info)
```
const firebaseConfig = {
  apiKey: "XXXXXXXXXXXX",
  authDomain: "XXXX",
  projectId: "XXXX",
  storageBucket: "XXXXX",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};
```

## .env

Create file under this project `Sakepedia-Nuxt3/app/.env`, fill info got from above:


```.env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGEING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## 3. Create .firebaserc

The project should already contain this file:

`.firebaserc`

```json
{
  "projects": {
    "default": "sakepedia-nuxt3"
  }
}
```

# Install and Build

It may take an hour, depends on your networking speed.

## 1. Create docker

- nuxt
  - Use Nuxt3 base container
- firebase
  - Use firebase emulator base container

```bash
cd Sakepedia-Nuxt3
docker-compose up -d

```

## 2. Init firebase

```bash
docker-compose run --rm firebase firebase login --no-localhost
```
- Collecting an error report is optional
- Access the URL that appears
- Check the session ID
- Paste the code that appears into the CLI
- If `Success! Logged in as xxxx` appears, you're logged in

# run

```bash
docker-compose exec nuxt bash
```

### nuxtコンテナ

```bash
yarn install
```

# Run

```bash
docker-compose exec nuxt bash
```
after enter container, run yarn

```
yarn dev
```

After yarn done, you can see the terminal have line like this
```
[11:23:47 AM] Nuxt 3.12.2 with Nitro 2.9.6
➜ Local:    http://0.0.0.0:3000/
...
...
etc.
...
[nitro 11:24:01 AM] ✔ Nuxt Nitro server built in 1630 ms
```


## Check service alive

Website:
http://localhost:3000/

Firebase Emulator:
http://localhost:4000/


# Deploy　

### Nuxt container
```bash
yarn install
yarn dev
```
### Browsing 
#### Sakepedia
http://localhost:3000/

#### Firebase Emulator
http://localhost:4000/


```bash
yarn build --preset=firebase
npx firebase-tools deploy --project sakepedia-nuxt3
```

# Linter

ESLint is used

## VSCode settings

1. Add extension for ESLint
1. Add the following items to `.vscode/settings.json`

```json
"eslint.experimental.useFlatConfig": true,
"eslint.workingDirectories": [
    "./app"
]
```

# Formatter

Prettier is used

## VSCode setting

1. Add Prettier extension into your VSCode

# Data import / export

## Export data to your local simulator

```
rm -rf /opt/data/bkp
firebase emulators:export /opt/data/bkp
```

# firestore Import
## Export to storage with firestore
## Download locally with gcloud

```
rm -rf /opt/data/bkp
gcloud storage cp -r "gs://sakepedia-data/2024-06-12T10:56:22_57740" /opt/data
mv /opt/data/2024-06-12T10:56:22_57740 /opt/data/bkp
```