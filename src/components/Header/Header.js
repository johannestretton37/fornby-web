import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
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
            {this.state.mainMenuItems.map((menuItem, i) => {
              return (
                <NavItem key={i}>
                  <CSSTransition
                    in={this.state.mainMenuItems.length > 0}
                    classNames="fade"
                    appear={true}
                    timeout={400}
                  >
                    <Link className="nav-link" to={menuItem.url}>
                      {menuItem.title}
                    </Link>
                  </CSSTransition>
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
