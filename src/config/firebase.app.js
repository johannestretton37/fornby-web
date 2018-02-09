import firebase from 'firebase'

const config = {
  dev: {
    apiKey: "AIzaSyAmKV3SJDTgGKSaHjy5KAoFXl82etzvxec",
    authDomain: "fornby-web-staging.firebaseapp.com",
    databaseURL: "https://fornby-web.firebaseio.com",
    // databaseURL: "https://fornby-web-staging.firebaseio.com",
    projectId: "fornby-web-staging",
    storageBucket: "fornby-web.appspot.com",
    // storageBucket: "fornby-web-staging.appspot.com",
    messagingSenderId: "48083410238"
  },
  prod: {
    apiKey: 'AIzaSyCNlsVrejriWDmqcskSvoa5nsW6keiLbSY',
    authDomain: 'fornby-web.firebaseapp.com',
    databaseURL: 'https://fornby-web.firebaseio.com',
    projectId: 'fornby-web',
    storageBucket: 'fornby-web.appspot.com',
    messagingSenderId: '1021161133791'
  }
}

const firebaseApp = firebase.initializeApp(process.env.REACT_APP_DATABASE === 'production' ? config.prod : config.dev)

export default firebaseApp
