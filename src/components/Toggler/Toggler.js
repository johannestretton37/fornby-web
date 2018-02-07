import React, { Component } from 'react'
import Icon from '../Icon'
import { func, bool, string } from 'prop-types'
import './Toggler.css'
  
class Toggler extends Component {
  static propTypes = {
    id: string,
    onClick: func.isRequired,
    isOpen: bool,
    className: string.isRequired,
    iconOpen: string.isRequired,
    iconClosed: string.isRequired,
    align: string,
  }

  static defaultProps = {
    isOpen: true
  }

  render() {
    const { id, isOpen, className, iconClosed, iconOpen, align } = this.props
    return (
      <div
        id={id}
        className={`${className} toggler${isOpen ? ' open' : ''}`}
        onClick={this.props.onClick}>
        <Icon name={isOpen ? iconClosed : iconOpen } align={align} size={40} />
      </div>
    )
  }
}

export default Toggler
