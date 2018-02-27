import React, { Component } from 'react'
import {string, number, element, object, oneOfType, arrayOf } from 'prop-types'
import './SmoothImage.css'
  
class SmoothImage extends Component {
  state = {
    isLoaded: false
  }

  static propTypes = {
    src: string,
    preview: object,
    width: number,
    height: number,
    className: string,
    children: oneOfType([element, arrayOf(element)])
  }

  componentDidMount() {
    this.loadImage(this.props.src)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.loadImage(nextProps.src)
    }
  }

  loadImage = (src) => {
    this.setState({
      isLoaded: false
    })
    const img = new Image()
    img.onload = () => {
      this.setState({ isLoaded: true })
    }
    img.src = src
  }

  render() {
    const { src, preview, width, height, className } = this.props
    let { isLoaded } = this.state
    return (
      <div className={`image-container${className ? ' ' + className : ''}${isLoaded ? ' is-loaded' : ''}`} style={{width: `${width}px`, height: `${height}px`}}>
        <div className='final-img' style={{
          backgroundImage: `url(${src})`,
        }}>
          {preview &&
          <div className='preview-img-container' style={{
            opacity: isLoaded ? 0 : 1,
            backgroundColor: preview.color || '#FFF'
          }}>
            <div className='preview-img' style={{
              filter: isLoaded ? 'blur(3px)':'blur(15px)',
              backgroundImage: `url(${preview.dataURI})`
            }}></div>
          </div>}
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default SmoothImage
