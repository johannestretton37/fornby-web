import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
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
      <TransitionGroup component='main'>
        <CSSTransition
          key={location.key}
          timeout={300}
          classNames='page-fade'
          appear={true}>
          <section className='main-container'>
            <Switch location={location}>
              <Route
                location={location}
                key={location.key}
                path="/:page"
                component={MainPage}
              />
              <Route path="/" component={StartPage} />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

export default Content
