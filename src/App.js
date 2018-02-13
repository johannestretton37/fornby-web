import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Content from './components/Content'
import StartPageCarousel from './components/StartPageCarousel'
import Footer from './components/Footer'
import DebugMessage from './components/DebugMessage'
import cms from './cms'
class App extends Component {
  state = {
    mainMenuItems: []
  }

  componentDidMount() {
    this.getMainMenuItems()
  }

  getMainMenuItems = async () => {
    try {
      const mainMenuItems = await cms.mainMenuItems()
      this.setState({
        mainMenuItems
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div id="app">
          {!cms.isProd && <DebugMessage />}
          <div className="full-width wrapper main-content">
            <Header />
            <Route path="/:city?" component={StartPageCarousel} />
            <Route component={Content} />
          </div>
          <Route render={({location}) => <Footer location={location} navLinks={this.state.mainMenuItems} /> } />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
