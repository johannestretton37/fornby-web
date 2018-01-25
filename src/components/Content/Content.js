import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import MainPage from '../MainPage'
import StartPage from '../StartPage'
// import ErrorPage from '../ErrorPage'
import './Content.css'

class Content extends Component {
  
  static propTypes = {
    location: PropTypes.object
  }
  render() {
    let { location } = this.props
    return (
      <main role="main">
        <Switch>
          <Route
            location={location}
            key={location.key}
            path="/:page"
            component={MainPage}
          />
          <Route path="/" component={StartPage} />
        </Switch>
      </main>
    )
  }
}



export default Content
