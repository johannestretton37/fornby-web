import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { object } from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import MainMenuItem from '../MainMenuItem'
import cms from '../../cms'
import './MainMenu.css'

class MainMenu extends Component {
  state = {
    mainMenuItems: [],
    activeItem: 0,
    left: '0px',
    width: '100px'
  }

  static propTypes = {
    history: object
  }

  componentDidMount() {
    this.getMainMenuItems()
  }

  getMainMenuItems = async () => {
    const mainMenuItems = await cms.mainMenuItems()
    this.setState({
      mainMenuItems
    })
  }

  navigate = (href, activeItem, indicatorPosition) => {
    this.props.history.push(href)
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
            width
          }}
        >
          &nbsp;
        </div>
      </div>
    )
  }
}

export default withRouter(MainMenu)
