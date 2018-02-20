import React from 'react'
import { instanceOf } from 'prop-types'
import { Link } from 'react-router-dom'
import CustomError from '../../models/CustomError'
import SearchBar from '../SearchBar'
import './ErrorPage.css'

ErrorPage.propTypes = {
  error: instanceOf(CustomError).isRequired,
}

function ErrorPage({ error: {title, message, rescueLink, rescueText, showSearch} }) {
  return (
    <div className='error-page'>
      <h2>{title}</h2>
      <p className="short-info">{message}</p>
      {rescueLink && <Link to={rescueLink}>{rescueText || 'Klicka här'}</Link>}
      {showSearch && <div>
        <p>Du kan söka efter det du letar efter här</p>
        <SearchBar
          isOpen={true}
          expandHorizontal={false} />
        <p style={{marginTop: '1em'}}>{'Eller klicka nedan för att komma tillbaka till tryggheten.'}</p>
        <Link to='/'>Till startsidan</Link>
      </div>}
    </div>
  )
}

export default ErrorPage
