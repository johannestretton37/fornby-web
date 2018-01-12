import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import Page from './components/Page'
import AdminPage from './components/AdminPage'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <Route path='/admin' component={AdminPage} />
          <Page />
        </main>
      </BrowserRouter>
    )
  }
}

export default App
