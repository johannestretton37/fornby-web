import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import cms from '../../cms'
import MainMenu from '../MainMenu'
import Toggler from '../Toggler'
import SearchBar from '../SearchBar'
import logo from '../../assets/fornby-logo.svg'
import './Header.css'

class Header extends Component {
  state = {
    mainMenuItems: [],
    activeItem: -1,
    left: '0px',
    top: '0px',
    width: '0px',
    height: '0px',
    isMainMenuOpen: false,
    isSearchBarOpen: false,
    isVertical: false
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

  /**
   * Mobile menu
   */
  handleMainMenuToggle = e => {
    e.preventDefault()
    this.setState(prevState => {
      return { isMainMenuOpen: !prevState.isMainMenuOpen }
    })
  }

  /**
   * Search bar
   */
  handleSearchBarToggle = e => {
    e.preventDefault()
    this.setState(prevState => {
      return { isSearchBarOpen: !prevState.isSearchBarOpen }
    })
  }

  render() {
    const { mainMenuItems, isMainMenuOpen, isSearchBarOpen } = this.state
    return (
      <header className="container">
        <div className="header-top-container">
          <Toggler
            className='main-menu-toggler'
            onToggle={this.handleMainMenuToggle}
            isOpen={isMainMenuOpen}
            iconOpen='menu'
            iconClosed='close'
            align='left'
            />
          <div className="brand-header">
            <h1>
              <a href="/">
                <img src={logo} className="logo" alt="logo" />
              </a>
            </h1>
          </div>
          <Toggler
            className='searchbar-toggler'
            onToggle={this.handleSearchBarToggle}
            isOpen={isSearchBarOpen}
            iconOpen='search'
            iconClosed='search'
            align='right'
            />
        </div>
        <MainMenu items={mainMenuItems} isOpen={isMainMenuOpen} />
        <SearchBar isOpen={isSearchBarOpen}  />
      </header>
    )
  }
}

export default withRouter(Header)
