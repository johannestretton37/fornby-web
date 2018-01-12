import React, { Component } from 'react'
import './App.css'
import Page from './components/Page'
import AdminContext from './components/AdminContext'

class App extends Component {
  render () {
    return (
      <main>
        <Page />
        <AdminContext>
          <p>This important text is protected by authentication. If you see this, you are logged in as an Editor and can add or delete courses.</p>
        </AdminContext>
      </main>
    )
  }
}

export default App
