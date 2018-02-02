import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { object } from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import MainMenuItem from '../MainMenuItem'
import logo from '../../assets/fornby-logo.svg'
import cms from '../../cms'
import './MainMenu.css'
import Icon from '../Icon'

class MainMenu extends Component {
  state = {
    mainMenuItems: [],
    activeItem: -1,
    left: '0px',
    top: '0px',
    width: '0px',
    height: '0px',
    isOpen: false,
    isVertical: false
  }

  static propTypes = {
    location: object,
    history: object
  }

  componentDidMount() {
    this.getMainMenuItems()
  }

  getMainMenuItems = async () => {
    const mainMenuItems = await cms.mainMenuItems()
    const { location } = this.props
    const mainPath = location.pathname.split('/')[1]
    let activeItem = 0
    let activeMenuItem = mainMenuItems.findIndex(
      item => item.url === '/' + mainPath
    )
    if (activeMenuItem) activeItem = activeMenuItem
    this.setState({
      mainMenuItems,
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

  /**
   * Mobile menu
   */
  toggleMenu = e => {
    e.preventDefault()
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen }
    })
  }

  render() {
    const {
      left,
      top,
      width,
      height,
      mainMenuItems,
      activeItem,
      isOpen,
      isVertical
    } = this.state
    // isVertical is true when mobile menu is visible
    let indicatorStyle = {
      opacity: mainMenuItems.length > 0 ? 1 : 0
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
        <div className="main-menu-header">
          <div
            className={`main-menu-toggler${isOpen ? ' open' : ''}`}
            onClick={this.toggleMenu}>
            <Icon name={isOpen ? 'close' : 'menu'} size={40} />
          </div>
          <div className="main-menu-logo">
            <a href="/">
              <img src={logo} className="logo" alt="logo" />
            </a>
          </div>
        </div>
        <nav
          className={`main-menu${isOpen ? ' open' : ' closed'}`}
          style={{ maxHeight: isOpen ? '400px' : '0px' }}>
          {mainMenuItems.map((menuItem, i, items) => {
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
