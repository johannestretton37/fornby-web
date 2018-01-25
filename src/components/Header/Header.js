import React from 'react'
import MainMenu from '../MainMenu'
import logo from '../../assets/logo.svg'
import './Header.css'

const Header = () => {
  return (
    <header className="container">
      <div className="brand-header">
        <h1>
          <a href="/">
            <img src={logo} className="logo" alt="logo" />
          </a>
        </h1>
      </div>
      <MainMenu />
    </header>
  )
}

export default Header
