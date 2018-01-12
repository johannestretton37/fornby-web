import React, { Component } from 'react'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import './AdminContext.css'

class AdminContext extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
  }
  componentDidMount() {
    console.warn('AdminContext loaded')
    const uiConfig = {
      signInSuccessUrl: 'http://localhost:3000/admin/cms',
      callbacks: {
        signInSuccess: this.signInSuccess
      },
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: 'http://localhost:3000/termsofservice'
    }

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth())

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken()
          .then((accessToken) => {
          console.log('sign-in-status', 'Signed in')
          console.log('sign-in', 'Sign out')
          console.log('account-details', JSON.stringify({
            displayName: displayName,
            email: email,
            emailVerified: emailVerified,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            uid: uid,
            accessToken: accessToken,
            providerData: providerData
          }, null, '  '))
          this.setState({
            isLoggedIn: true
          })
        });
      } else {
        // User is signed out.
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig)
      }
    }, function(error) {
      console.log(error);
    })
  }
  signInSuccess = (currentUser, credential, redirectUrl) => {
    this.setState({
      isLoggedIn: true
    })
    return true
  }
  render() {
    return this.state.isLoggedIn ? this.props.children : <div id="firebaseui-auth-container">Login</div>
  }
}

export default AdminContext
