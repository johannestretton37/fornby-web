import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'
import AdminPage from './components/AdminPage'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: []
    }
  }
  componentDidMount() {
    cms.pages()
      .then(pages => {
        this.setState({
          pages
        })
      })
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route path="/admin" component={AdminPage} />
          <Content />
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
