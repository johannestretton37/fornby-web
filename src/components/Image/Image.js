import React, { Component } from 'react'
import './Image.css'
  
class Image extends Component {
  render() {
    const { src, height, className } = this.props
    return (
      <div className={`image-container${className ? ' ' + className : ''}`} style={{ height: `${height}px` }}>
        <figure style={{ backgroundImage: `url(${src})`}}></figure>
      </div>
    )
  }
}

export default Image
