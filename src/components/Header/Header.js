import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import cms from '../../cms'
import logo from '../../assets/logo.svg'
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
        <div className="brand-header">
          <h1>  
            <a href="/">
              <img src={logo} className="logo" alt="logo" />
            </a>
          </h1>
        </div>
        <nav className="main-menu">
          {this.state.mainMenuItems.map((menuItem, i, items) => {
            return (
              <CSSTransition
                key={i}
                in={this.state.mainMenuItems.length > 0}
                classNames="fade"
                appear={true}
                timeout={400}
              >
                <div className='nav-item'>
                  <Link className={`nav-link${i === items.length - 1 ? ' last' : ''}`} to={menuItem.url}>
                    {menuItem.title}
                  </Link>
                </div>
              </CSSTransition>
            )
          })}
        </nav>
      </header>
    )
  }
}

export default Header
