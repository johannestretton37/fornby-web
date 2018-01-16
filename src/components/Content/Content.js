import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import CoursesPage from '../CoursesPage'
import CoursePage from '../CoursePage'
import MainPage from '../MainPage'
import ErrorPage from '../ErrorPage'
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

export default Content
