import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap'
import cms from '../../cms'
import logo from '../../assets/logo.png'
import './Header.css'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mainMenuItems: []
    }
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

  render() {
    return (
      <header className="container">
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/">
            <img src={logo} className="logo" alt="logo" /> Fornby Folkhögskola
            <span>
              <small>&mdash; En levande mötesplats</small>
            </span>
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to='/'>
                Start
              </Link>
            </NavItem>
            {this.state.mainMenuItems.map((menuItem, i) => {
              return (
                <NavItem key={i}>
                  <Link className="nav-link" to={menuItem.url}>
                    {menuItem.title}
                  </Link>
                </NavItem>
              )
            })}
          </Nav>
        </Navbar>
      </header>
    )
  }
}

export default Header
