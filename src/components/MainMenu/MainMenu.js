import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { object, array, bool } from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import MainMenuItem from '../MainMenuItem'
import logo from '../../assets/fornby-logo.svg'
import './MainMenu.css'


class MainMenu extends Component {
  state = {
    items: [],
    activeItem: -1,
    left: '0px',
    top: '0px',
    width: '0px',
    height: '0px',
    isVertical: false
  }

  static propTypes = {
    items: array.isRequired,
    isOpen: bool,
    location: object,
    history: object
  }

  componentDidMount() {
    this.findActiveItem()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.length !== this.props.items.length) {
      this.setState({
        items: nextProps.items
      }, () => {
        this.findActiveItem()
      })
    }
  }

  findActiveItem = () => {
    const { location } = this.props
    const { items } = this.state
    const mainPath = location.pathname.split('/')[1]
    let activeItem = -1
    let activeMenuItem = items.findIndex(
      item => item.url === '/' + mainPath
    )
    if (activeMenuItem) activeItem = activeMenuItem
    this.setState({
      activeItem
    })
  }

  navigate = href => {
    let { location, history } = this.props
    if (href !== location.pathname) {
      history.push(href)
    }
  }

  updateIsVertical = isVertical => {
    this.setState({ isVertical })
  }

  updateIndicator = () => {}

  moveIndicator = (
    activeItem,
    indicatorPosition,
    withOutTransition = false
  ) => {
    if (this.activeIndicator && withOutTransition) {
      if (this.activeIndicator.style.transition !== 'none') {
        this.indicatorTransition = this.activeIndicator.style.transition
      }
      this.activeIndicator.style.transition = 'none'
      setTimeout(() => {
        this.activeIndicator.style.transition = this.indicatorTransition
      }, 100)
    }
    this.setState({
      activeItem,
      ...indicatorPosition
    })
  }

  render() {
    const {
      left,
      top,
      width,
      height,
      activeItem,
      isVertical
    } = this.state
    const { items, isOpen } = this.props
    // isVertical is true when mobile menu is visible
    let indicatorStyle = {
      opacity: items.length > 0 ? 1 : 0
    }
    if (isVertical) {
      indicatorStyle.top = top
      indicatorStyle.width = '2px'
      indicatorStyle.height = height
      if (!isOpen) indicatorStyle.opacity = 0
    } else {
      indicatorStyle.left = left
      indicatorStyle.width = width
      indicatorStyle.height = '2px'
    }
    return (
      <div className="main-menu-container">
        <nav
          className={`main-menu${isOpen ? ' open' : ' closed'}`}
          style={{ maxHeight: isOpen ? '400px' : '0px' }}>
          {items.map((menuItem, i, items) => {
            return (
              <CSSTransition
                key={i}
                in={true}
                classNames="fade"
                appear={true}
                timeout={400}>
                <MainMenuItem
                  item={menuItem}
                  navigate={this.navigate}
                  moveIndicator={this.moveIndicator}
                  updateIsVertical={this.updateIsVertical}
                  order={i}
                  isActive={activeItem === i}
                  isFirst={i === 0}
                  isLast={i === items.length - 1}
                  isVertical={isVertical}
                />
              </CSSTransition>
            )
          })}
        </nav>
        <div
          id="main-menu-indicator"
          ref={activeIndicator => {
            this.activeIndicator = activeIndicator
          }}
          style={indicatorStyle}>
          &nbsp;
        </div>
      </div>
    )
  }
}

export default withRouter(MainMenu)
