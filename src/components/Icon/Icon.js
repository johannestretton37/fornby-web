import React from 'react'
import Icons from '../../assets/Icons.svg' 
import './Icon.css'
  
const Icon = ({name, color, size}) => {
  return (
    <svg className={`icon icon-${name}`} fill={color} width={size} height={size}>
      <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
  )
}

export default Icon