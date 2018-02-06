import React, { Component } from 'react'
import Icon from '../Icon'
import { func, bool, string } from 'prop-types'
import './Toggler.css'
  
class Toggler extends Component {
  static propTypes = {
    onToggle: func.isRequired,
    isOpen: bool.isRequired,
    className: string.isRequired,
    iconOpen: string.isRequired,
    iconClosed: string.isRequired,
    align: string,
  }

  render() {
    const { isOpen, className, iconClosed, iconOpen, align } = this.props
    return (
      <div
        className={`${className} toggler${isOpen ? ' open' : ''}`}
        onClick={this.props.onToggle}>
        <Icon name={isOpen ? iconClosed : iconOpen } align={align} size={40} />
      </div>
    )
  }
}

export default Toggler
