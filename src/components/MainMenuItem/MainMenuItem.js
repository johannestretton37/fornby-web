import React, { Component } from 'react'
import { object, number, bool, func } from 'prop-types'
import './MainMenuItem.css'

class MainMenuItem extends Component {
  static propTypes = {
    item: object.isRequired,
    navigate: func.isRequired,
    order: number.isRequired,
    isActive: bool,
    isLast: bool
  }

  static defaultProps = {
    isActive: false,
    isLast: false
  }

  handleClick = e => {
    e.preventDefault()
    const href = e.currentTarget.attributes.href.nodeValue
    const left = e.currentTarget.childNodes[0].offsetLeft + 'px'
    const width = e.currentTarget.childNodes[0].offsetWidth + 'px'
    this.props.navigate(href, this.props.order, {left, width})
  }

  render() {
    const { item, isActive, isLast } = this.props
    return (
      <div className="nav-item">
        <a
          onClick={this.handleClick}
          className={`nav-link${isLast ? ' last' : ''}${isActive ? ' active' : ''}`}
          href={item.url}
        >
          <span>{item.title}</span>
        </a>
      </div>
    )
  }
}

export default MainMenuItem
