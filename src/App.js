import Fire from './Fire'
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'
class App extends Component {
  render() {
    return (
      <main>
        <Header/>
        <Content/>
        <Footer/>
      </main>
    )
  }
}

export default App
