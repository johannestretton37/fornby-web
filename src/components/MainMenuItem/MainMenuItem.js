import React, { Component } from 'react'
import { object, number, bool, func } from 'prop-types'
import './MainMenuItem.css'

class MainMenuItem extends Component {
  static propTypes = {
    item: object.isRequired,
    navigate: func.isRequired,
    updateIsVertical: func.isRequired,
    moveIndicator: func.isRequired,
    order: number.isRequired,
    isActive: bool,
    isFirst: bool,
    isLast: bool,
    isVertical: bool
  }

  static defaultProps = {
    isActive: false,
    isFirst: false,
    isLast: false,
    isVertical: false
  }

  componentDidMount() {
    if (this.props.isActive) {
      this.updateIsVertical(window.innerWidth < 768)
      this.moveIndicator(true)
      window.addEventListener('resize', this.handleResize)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isActive && this.props.isActive) {
      // This item toggled to inactive, remove listener
      window.removeEventListener('resize', this.handleResize)
    }
    if (nextProps.isActive && !this.props.isActive) {
      // This item toggled to active, add listener
      window.addEventListener('resize', this.handleResize)
      this.moveIndicator()
      this.updateIsVertical(window.innerWidth < 768)
    }
  }

  handleResize = e => {
    // TODO: Throttle this!
    this.updateIsVertical(e.target.innerWidth < 768)
    this.moveIndicator(true)
  }

  handleClick = e => {
    e.preventDefault()
    this.moveIndicator()
    this.navigate()
  }
  
  titleSpanMeasurements = () => {
    const left = this.titleSpan.offsetLeft + 'px'
    const top = this.titleSpan.offsetTop + 'px'
    const width = this.titleSpan.offsetWidth + 'px'
    const height = this.titleSpan.offsetHeight + 'px'
    return {left, top, width, height}
  }
  
  navigate = () => {
    const { navigate, item: { url } } = this.props
    navigate(url)
  }

  updateIsVertical = (isVertical) => {
    this.props.updateIsVertical(isVertical)
  }
  moveIndicator = (withOutTransition) => {
    const { order } = this.props
    this.props.moveIndicator(order, this.titleSpanMeasurements(), withOutTransition)
  }

  render() {
    const { item, isActive, isFirst, isLast } = this.props
    return (
      <div className="nav-item">
        <a
          onClick={this.handleClick}
          className={`nav-link${isFirst ? ' first' : ''}${isLast ? ' last' : ''}${isActive ? ' active' : ''}`}
          href={item.url}
        >
          <span ref={(titleSpan) => { this.titleSpan = titleSpan }}>{item.title}</span>
        </a>
      </div>
    )
  }
}

export default MainMenuItem
