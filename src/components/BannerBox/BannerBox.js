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
    //TODO Fix title or name to one
    const { content: { title, name, shortInfo, images, previews, link, url } } = this.props
    let src = images ? images[0].url || '' : ''
    let preview = previews ? previews[0] : undefined
    return (
      <Col xs="12" md="6" xl="4" className='banner-box'>
        <Link to={link || url || '/'}>
          <div className='banner'>
            <SmoothImage src={src} preview={preview} className='hero-image-container'>
              <h3 style={{ margin: 'auto auto 0.3em 20px', color: '#fff' }}>{title || title || ''}</h3>
            </SmoothImage>
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
