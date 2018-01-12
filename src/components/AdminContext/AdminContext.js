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
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig)
  }
  signInSuccess = (currentUser, credential, redirectUrl) => {
    this.setState({
      isLoggedIn: true
    })
    return false
  }
  render() {
    return this.state.isLoggedIn ? this.props.children : <div id="firebaseui-auth-container">Login</div>
  }
}

export default AdminContext
