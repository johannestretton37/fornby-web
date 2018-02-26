import React, { Component } from 'react'
import { object, number, bool, func } from 'prop-types'
import Icon from '../Icon'
import cms from '../../cms'
import './MainMenuItem.css'

class MainMenuItem extends Component {
  state = {
    showSubItems: false
  }

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
    cms.selectedCity = undefined
    let url = e.currentTarget.href.replace(window.location.origin, '')
    this.moveIndicator()
    this.navigate(url)
  }
  
  titleSpanMeasurements = () => {
    const left = this.titleSpan.parentElement.parentElement.offsetLeft + this.titleSpan.parentElement.offsetLeft + this.titleSpan.offsetLeft + 'px'
    const top = this.titleSpan.parentElement.parentElement.offsetTop + this.titleSpan.parentElement.offsetTop + this.titleSpan.offsetTop + 'px'
    const width = this.titleSpan.offsetWidth + 'px'
    const height = this.titleSpan.offsetHeight + 'px'
    return {left, top, width, height}
  }
  
  navigate = (href) => {
    const { navigate, item: { url } } = this.props
    this.setState({ showSubItems: false })
    navigate(href || url)
  }

  updateIsVertical = (isVertical) => {
    this.props.updateIsVertical(isVertical)
  }
  moveIndicator = (withOutTransition) => {
    const { order } = this.props
    this.props.moveIndicator(order, this.titleSpanMeasurements(), withOutTransition)
  }

  subItemsToggler = () => {
    if (this.props.item.children.length === 0) return null
    return <a className={`sub-items-toggler${this.state.showSubItems ? ' open' : ''}`} onClick={this.toggleSubItem}><Icon name="plus" size={20} /></a>
  }

  toggleSubItem = e => {
    e.preventDefault()
    this.setState(prevState => ({showSubItems: !prevState.showSubItems}))
  }

  render() {
    const { item, isActive, isFirst, isLast, item: { children } } = this.props
    return (
      <div className="nav-item">
        <div className="main-item-container">
          <a
            onClick={this.handleClick}
            className={`nav-link${isFirst ? ' first' : ''}${isLast ? ' last' : ''}${isActive ? ' active' : ''}`}
            href={item.url}
          >
            <span ref={(titleSpan) => { this.titleSpan = titleSpan }}>{item.title}</span>
          </a>
          {this.subItemsToggler()}
        </div>
        {children.length > 0 &&
        <div className={`nav-sub-items ${this.state.showSubItems ? 'open' : 'closed'}`}>
          {children.map(subItem => {
            return (
              <a onClick={this.handleClick} href={subItem.url} key={subItem.url} className={`nav-item nav-link nav-sub-item`}>
                <i>{subItem.title}</i>
              </a>
            )
          })}
        </div>
        }
      </div>
    )
  }
}

export default MainMenuItem
