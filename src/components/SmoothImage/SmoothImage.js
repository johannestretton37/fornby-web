import React, { Component } from 'react'
import {string, number} from 'prop-types'
import './SmoothImage.css'
  
class SmoothImage extends Component {
  state = {
    isLoaded: false
  }

  static propTypes = {
    src: string,
    preview: string,
    height: number,
    className: string
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
    const { src, preview, height, className } = this.props
    let { isLoaded } = this.state
    if (!src) return null
    return (
      <div className={`image-container${className ? ' ' + className : ''}`} style={{ height: `${height}px` }}>
        <div className='final-img' style={{ backgroundImage: `url(${src})`}}>
          {preview && <div className='preview-img' style={{ opacity: isLoaded ? 0 : 1, backgroundImage: `url(${preview})`}}></div>}
        </div>
      </div>
    )
  }
}

export default SmoothImage
