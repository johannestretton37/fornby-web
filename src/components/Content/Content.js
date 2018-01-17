import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import MainPage from '../MainPage'
// import ErrorPage from '../ErrorPage'
import './Content.css'

class Content extends Component {
  render() {
    let { location } = this.props
    return (
      <main role="main" className='h-100'>
        <Route
          location={location}
          key={location.key}
          path="/:page"
          component={MainPage}
          />
      </main>
    )
  }
}

Content.propTypes = {
  location: PropTypes.object
}

export default Content
