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
  onEnter = (node, isAppearing) => {
    console.log(node, isAppearing)
    // Check if footer needs to be animated down or up
  }

  render() {
    let { location } = this.props
    return (
      <TransitionGroup component='main'>
        <CSSTransition
          key={location.key}
          timeout={300}
          onEnter={this.onEnter}
          classNames='page-fade'
          appear={true}>
          <section className='main-container'>
            <Switch location={location}>
              <Route path="/borlange" component={StartPage} />
              <Route
                location={location}
                key={location.key}
                path="/:page/:subpage?/:detailPage?"
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
