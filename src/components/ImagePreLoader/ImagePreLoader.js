import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ImagePreLoader.css'

class ImagePreLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPreview: true,
      showFinal: false,
      maxHeight: '100%'
    }
  }
  static defaultProps = {
    initialHeight: '200px',
    bgColor: '#500'
  }

  static propTypes = {
    initialHeight: PropTypes.string,
    bgColor: PropTypes.string,
    previewImg: PropTypes.string,
    children: PropTypes.element
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewImg !== this.props.previewImg) {
      let previewImg = new Image()
      const containerWidth = this.container.getBoundingClientRect().width
      previewImg.onload = () => {
        const ratio = previewImg.height / previewImg.width
        let calcHeight = (containerWidth * ratio) + 'px'
        this.setState({
          showPreview: true,
          maxHeight: calcHeight
        })
      }
      previewImg.src = nextProps.previewImg
    }
    if (nextProps.children.props.src !== this.props.children.props.src) {
      let img = new Image()
      const containerWidth = this.container.getBoundingClientRect().width
      img.onload = () => {
        const ratio = img.height / img.width
        let calcHeight = (containerWidth * ratio) + 'px'
        this.setState({
          showPreview: false,
          showFinal: true,
          maxHeight: calcHeight
        }, () => {
          setTimeout(() => {
            this.setState({
              maxHeight: '100%'
            })
          }, 600)
        })
      }
      img.src = nextProps.children.props.src
      this.setState({ src: nextProps.children.props.src })
    }
  }

  render() {
    const { showPreview, showFinal } = this.state
    return (
      <div
        className="image-preloader"
        ref={input => { this.container = input }}
        style={{ maxHeight: showPreview ? this.props.initialHeight : this.state.maxHeight }}
      >
        <div
          className="preview-container"
          style={{
            backgroundColor: this.props.bgColor,
            backgroundImage: `url(${this.props.previewImg})`,
            opacity: showPreview ? 1 : 0,
            filter: showFinal ? 'blur(0px)' : 'blur(15px)'
          }}
        />
        {showFinal && this.props.children}
      </div>
    )
  }
}



export default ImagePreLoader
