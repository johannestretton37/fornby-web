import React from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router-dom'
import './ErrorPage.css'

ErrorPage.propTypes = {
  heading: string,
  message: string,
  buttonText: string,
  buttonHref: string
}

function ErrorPage({ heading, message, buttonText, buttonHref }) {
  return (
    <div>
      <h2>404</h2>
      <p><b>{heading || 'Ooops, här finns ingenting att se.'}</b></p>
      <p>{message || 'Tryck på knappen för att komma tillbaka till tryggheten.'}</p>
      <Link to={buttonHref || '/'}>{buttonText || 'Till startsidan'}</Link>
    </div>
  )
}

export default ErrorPage
