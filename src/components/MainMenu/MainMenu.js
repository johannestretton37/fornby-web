import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { object } from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import MainMenuItem from '../MainMenuItem'
import logo from '../../assets/logo.svg'
import cms from '../../cms'
import './MainMenu.css'

class MainMenu extends Component {
  state = {
    mainMenuItems: [],
    activeItem: -1,
    left: '0px',
    width: '0px',
    isOpen: false
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
    let activeMenuItem = mainMenuItems.find(
      item => item.url === '/' + mainPath
    )
    if (activeMenuItem) activeItem = activeMenuItem.order
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

  updateIndicator = () => {

  }

  moveIndicator = (activeItem, indicatorPosition, withOutTransition = false) => {
    if (!this.activeIndicator) return false
    let transition = this.activeIndicator.style.transition
    if (withOutTransition) {
      this.activeIndicator.style.transition = 'none'
    }
    this.setState({
      activeItem,
      ...indicatorPosition
    }, () => {
      if (withOutTransition) {
        setTimeout(() => {
          this.activeIndicator.style.transition = transition
        }, 10)
      }
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
    const { left, width, mainMenuItems, activeItem, isOpen } = this.state
    return (
      <div className="main-menu-container">
        <div className="main-menu-header">
          <div className={`main-menu-toggler${isOpen ? ' open' : ''}`} onClick={this.toggleMenu}>HAMBURGER</div>
          <div className='main-menu-logo'>
            <a href="/">
              <img src={logo} className="logo" alt="logo" />
            </a>    
          </div>
        </div>
        <nav className="main-menu" style={{ maxHeight: isOpen ? '400px' : '0px' }} >
          {mainMenuItems.map((menuItem, i, items) => {
            return (
              <CSSTransition
                key={i}
                in={true}
                classNames="fade"
                appear={true}
                timeout={400}
              >
                <MainMenuItem
                  item={menuItem}
                  navigate={this.navigate}
                  moveIndicator={this.moveIndicator}
                  order={i}
                  isActive={activeItem === i}
                  isLast={i === items.length - 1}
                />
              </CSSTransition>
            )
          })}
        </nav>
          <div
            id="main-menu-indicator"
            ref={(activeIndicator) => { this.activeIndicator = activeIndicator }}
            style={{
              left,
              width,
              opacity: mainMenuItems.length > 0 ? 1 : 0
            }}
          >
            &nbsp;
          </div>
      </div>
    )
  }
}

export default withRouter(MainMenu)
