import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { object } from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import MainMenuItem from '../MainMenuItem'
import cms from '../../cms'
import './MainMenu.css'

class MainMenu extends Component {
  state = {
    mainMenuItems: [],
    activeItem: -1,
    left: '0px',
    width: '0px'
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

  moveIndicator = (activeItem, indicatorPosition) => {
    this.setState({
      activeItem,
      ...indicatorPosition
    })
  }

  render() {
    const { left, width, mainMenuItems, activeItem } = this.state
    return (
      <div className="main-menu-container">
        <nav className="main-menu">
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
