import React from 'react'
import { string } from 'prop-types'
import Icon from '../Icon'
import './Linkable.css'

const Linkable = ({ id, title, url }) => {
  return (
    <h4 id={id} className="linkable">
      <a href={url}><Icon name='link-bold' size={26} /></a>
      {title}
    </h4>
  )
}

Linkable.propTypes = {
  id: string,
  title: string,
  url: string
}

export default Linkable
