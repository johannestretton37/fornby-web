import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div id="app">
          <div className="container-fluid wrapper main-content">
            <Header />
            <Route component={Content} />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
