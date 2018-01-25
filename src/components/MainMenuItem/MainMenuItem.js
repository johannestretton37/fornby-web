import React, { Component } from 'react'
import { object, number, bool, func } from 'prop-types'
import './MainMenuItem.css'

class MainMenuItem extends Component {
  static propTypes = {
    item: object.isRequired,
    navigate: func.isRequired,
    moveIndicator: func.isRequired,
    order: number.isRequired,
    isActive: bool,
    isLast: bool
  }

  static defaultProps = {
    isActive: false,
    isLast: false
  }

  componentDidMount() {
    if (this.props.isActive) this.moveIndicator()
  }

  handleClick = e => {
    e.preventDefault()
    this.moveIndicator()
    this.navigate()
  }
  
  titleSpanMeasurements = () => {
    const left = this.titleSpan.offsetLeft + 'px'
    const width = this.titleSpan.offsetWidth + 'px'
    return {left, width}
  }
  
  navigate = () => {
    const { navigate, item: { url } } = this.props
    navigate(url)
  }

  moveIndicator = () => {
    const { order } = this.props
    this.props.moveIndicator(order, this.titleSpanMeasurements())
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
          <span ref={(titleSpan) => { this.titleSpan = titleSpan }}>{item.title}</span>
        </a>
      </div>
    )
  }
}

export default MainMenuItem
