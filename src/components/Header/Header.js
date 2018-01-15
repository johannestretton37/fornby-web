import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
      <header>
        <img src={logo} className="logo" alt="logo" />
        <h1>Fornby Folkhögskola</h1>
        <p>&mdash; En levande mötesplats</p>

        <h2>Main Menu</h2>
        <nav>
          {this.state.mainMenuItems.map((menuItem, i) => {
            return (
              <li key={i}>
                <Link to={menuItem.url}>{menuItem.title}</Link>
              </li>
            )
          })}
        </nav>
      </header>
    )
  }
}

export default Header
