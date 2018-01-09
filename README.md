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

Build and deploy by running the commands below. You might have to log in to firebase at some point.
After deploy has completed, you'll be able to reach the app at <https://fornby-web.firebaseapp.com>

```bash
# Build locally
yarn build
# Deploy
yarn deploy
```

Automatically build and deploy to production by using

```bash
yarn release
```

To edit app settings, go to <https://console.firebase.google.com/project/fornby-web/overview>
