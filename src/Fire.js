import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyCNlsVrejriWDmqcskSvoa5nsW6keiLbSY',
  authDomain: 'fornby-web.firebaseapp.com',
  databaseURL: 'https://fornby-web.firebaseio.com',
  projectId: 'fornby-web',
  storageBucket: 'fornby-web.appspot.com',
  messagingSenderId: '1021161133791'
}

const firebaseApp = firebase.initializeApp(config)

export default firebaseApp
