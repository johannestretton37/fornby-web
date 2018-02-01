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
    if (this.props.isActive) {
      this.moveIndicator(true)
      window.addEventListener('resize', this.handleResize)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isActive && this.props.isActive) {
      console.log(this.props.order, 'is no longer active')
      // This item toggled to inactive, remove listener
      window.removeEventListener('resize', this.handleResize)
    } else if (nextProps.isActive && !this.props.isActive) {
      // This item toggled to active, add listener
      window.addEventListener('resize', this.handleResize)      
    }
  }

  handleResize = e => {
    console.log(this.props.order)
    this.moveIndicator(true)
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

  moveIndicator = (withOutTransition) => {
    const { order } = this.props
    this.props.moveIndicator(order, this.titleSpanMeasurements(), withOutTransition)
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
