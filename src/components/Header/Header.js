import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom'
import cms from '../../cms'
import MainMenu from '../MainMenu'
import Toggler from '../Toggler'
import Search from '../Search'
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

  closeMenu = () => {
    this.setState({ isMainMenuOpen: false })
  }

  /**
   * Search bar
   */
  handleSearchBarToggle = () => {
    this.toggleSearchBar()
  }
  
  toggleSearchBar = () => {
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
            onClick={this.handleMainMenuToggle}
            isOpen={isMainMenuOpen}
            iconOpen='menu'
            iconClosed='close'
            align='left'
            />
          <div className="brand-header">
            <a href="/">
              <h1>Fornby Folkhögskola</h1>
            </a>
          </div>
          <Toggler
            id='searchbar-toggler-small-screens'
            className='searchbar-toggler'
            onClick={this.handleSearchBarToggle}
            isOpen={isSearchBarOpen}
            iconOpen='search'
            iconClosed='search'
            align='right'
            />
            <Search
              isSearchBarOpen={isSearchBarOpen}
              toggleSearchBar={this.toggleSearchBar}
              expandHorizontal={true} />
        </div>
        <Route path='/:page?' render={props => <MainMenu {...props} closeMenu={this.closeMenu} items={mainMenuItems} isOpen={isMainMenuOpen} />} />
        <Search
          isSearchBarOpen={isSearchBarOpen}
          toggleSearchBar={this.toggleSearchBar}
          expandHorizontal={false}/>
      </header>
    )
  }
}

export default withRouter(Header)
