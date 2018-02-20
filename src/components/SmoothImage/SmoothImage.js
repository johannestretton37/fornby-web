import React, { Component } from 'react'
import {string, number, element, object} from 'prop-types'
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
    children: element
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
    const img = new Image()
    img.onload = () => {
      this.setState({ isLoaded: true })
    }
    img.src = src
  }

  render() {
    const { src, preview, width, height, className } = this.props
    let { isLoaded } = this.state
    if (!src) return null
    return (
      <div className={`image-container${className ? ' ' + className : ''}`} style={{width: `${width}px`, height: `${height}px`}}>
        <div className='final-img' style={{
          backgroundImage: `url(${src})`,
        }}>
          {preview &&
          <div className='preview-img-container' style={{
            opacity: isLoaded ? 0 : 1,
            backgroundColor: preview.color
          }}>
            <div className='preview-img' style={{
              filter: isLoaded ? 'blur(0px)':'blur(10px)',
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
