import React, { Component } from 'react'
import {string, number} from 'prop-types'
import './Image.css'
  
class Image extends Component {
  static propTypes = {
    src: string,
    height: number,
    className: string
  }

  render() {
    const { src, height, className } = this.props
    if (!src) return null
    return (
      <div className={`image-container${className ? ' ' + className : ''}`} style={{ height: `${height}px` }}>
        <figure style={{ backgroundImage: `url(${src})`}}></figure>
      </div>
    )
  }
}

export default Image
