import React, { Component } from 'react'
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import SmoothImage from '../SmoothImage'
import './BannerBox.css'

class BannerBox extends Component {
  
  static propTypes = {
    content: PropTypes.object.isRequired
  }

  render() {
    const { content: { title, shortInfo, images, previews, link } } = this.props
    let src = images[0].url
    let preview = previews[0]
    return (
      <Col xs="12" md="6" xl="4" className='banner-box'>
        <Link to={link||'/'}>
          <div className='banner'>
            <SmoothImage src={src} preview={preview} className='hero-image-container'>
              <h3 style={{margin: 'auto auto 0.3em 20px', color: '#fff'}}>{title}</h3>
            </SmoothImage>
            {/* <figure className='hero-image-container'>
              <div className='hero-image' style={{ backgroundImage: `url(${src})` }}>
                <h3>{title}</h3>
              </div>
            </figure> */}
            <div className='banner-body'>
              <p>{shortInfo}</p>
              <div className='read-more'>
                <span>LÄS MER</span>
              </div>
            </div>
          </div>
        </Link>
      </Col>
    )
  }
}


export default BannerBox
