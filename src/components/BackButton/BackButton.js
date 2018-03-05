import React, { Component } from 'react'
import { object, string } from 'prop-types'
import { withRouter } from 'react-router-dom'
import './BackButton.css'

class BackButton extends Component {
  static propTypes = {
    history: object.isRequired,
    location: object,
    prevPage: string,
    overridePage: string
  }

  handleClick = e => {
    e.preventDefault()
    if (this.props.overridePage) {
      this.props.history.push(this.props.overridePage);
    } else {
      this.props.history.goBack()
    }
  }

  render() {
    return (
      <a href={this.props.location.pathname} onClick={this.handleClick}>{this.props.prevPage ? `Tillbaka till ${this.props.prevPage}` : 'Tillbaka'}</a>
    )
  }
}

export default withRouter(BackButton)
