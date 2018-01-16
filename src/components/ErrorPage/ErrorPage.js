import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './ErrorPage.css'

const ErrorPage = ({ heading, message, linkText, href }) => {
  return (
    <div>
      <h2>404</h2>
      <p><b>{heading || 'Ooops, här finns ingenting att se.'}</b></p>
      <p>{message || 'Tryck på knappen för att komma tillbaka till tryggheten.' }</p>
      <Link to={href || '/'}>{linkText || 'Till startsidan'}</Link>
    </div>
  )
}

export default ErrorPage
