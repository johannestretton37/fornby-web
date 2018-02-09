# Fornby Folkhögskola

## Setup

Install **Firebase Tools** globally

```bash
npm install -g firebase-tools
```

Install dependencies

```bash
yarn install
```

## Development

Start dev server locally

```bash
yarn start
```

## Deploy

Automatically build and deploy by using

```bash
# Deploy to staging
yarn release:dev
# Deploy to production
yarn release:prod
```

Build and deploy by running the commands below. You might have to log in to firebase at some point.
After deploy has completed, you'll be able to reach the app at these URLs

- Production: <https://fornby-web.firebaseapp.com>
- Staging: <https://fornby-web-staging.firebaseapp.com>

```bash
# Build locally
yarn build
# Deploy
firebase deploy
```

To edit app settings, go to <https://console.firebase.google.com/project/fornby-web/overview>
