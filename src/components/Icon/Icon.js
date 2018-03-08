import React from 'react'
import Icons from '../../assets/Icons.svg'
import {string, number} from 'prop-types'
import './Icon.css'
  
const Icon = ({name, fillColor, strokeColor, strokeWidth = '46px', hoverColor, size, align}) => {
  let iconName = name
  let styles = {
    strokeWidth
  }
  const suffixIndex = name.indexOf('__')
  if (suffixIndex > -1) {
    iconName = name.substr(0, suffixIndex)
    switch (name.substr(suffixIndex + 2)) {
      case 'up':
        styles.transform = 'rotateZ(90deg)'
      break
      case 'right':
        styles.transform = 'rotateZ(180deg)'
      break
      case 'down':
        styles.transform = 'rotateZ(-90deg)'
      break
      default:
        styles.transform = 'rotateZ(0deg)'
      break
    }
  }

  return (
    <div className={`icon-container${align !== undefined ? ' ' + align : ''}`}>
      <svg className={`icon icon-${iconName}${hoverColor ? ' hover-' + hoverColor : ''}`} style={{ ...styles, fill: fillColor, stroke: strokeColor }} width={size} height={size}>
        <use xlinkHref={`${Icons}#icon-${iconName}`} />
      </svg>
    </div>
  )
}

Icon.propTypes = {
  name: string.isRequired,
  fillColor: string,
  strokeColor: string,
  hoverColor: string,
  size: number,
  align: string
}

export default Icon
