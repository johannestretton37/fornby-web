import React, { Component } from 'react'
import { object, string } from 'prop-types'
import { withRouter } from 'react-router-dom'
import Icon from '../Icon'
import './BackButton.css'
import { Colors } from '../../constants';

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
      <a className='back-button' href={this.props.location.pathname} onClick={this.handleClick}>
        <Icon
        name='arrow__left'
        size={24}
        strokeColor={Colors.secondary}
        strokeWidth='58px'
        hoverColor='primary' />
        {this.props.prevPage ? `Tillbaka till ${this.props.prevPage}` : 'Tillbaka'}
      </a>
    )
  }
}

export default withRouter(BackButton)
