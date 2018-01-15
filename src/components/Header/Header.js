import React, { Component } from 'react'
import logo from '../../assets/logo.png'
import './Header.css'

class Header extends Component {
  render() {
    return (
      <header>
        <img src={logo} className="logo" alt="logo" />
        <h1>Fornby Folkhögskola</h1>
        <p>&mdash; En levande mötesplats</p>
      </header>
    )
  }
}

export default Header
