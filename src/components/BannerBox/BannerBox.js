import React, { Component } from 'react'
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './BannerBox.css'

class BannerBox extends Component {
  
  static propTypes = {
    content: PropTypes.object.isRequired
  }

  render() {
    const { content: { title, shortInfo, images, link } } = this.props
    let url = images[0].url
    return (
      <Col xs="12" md="6" xl="4" className='banner-box'>
        <Link to={link||'/'}>
          <div className='banner'>
            <figure className='hero-image-container'>
              <div className='hero-image' style={{ backgroundImage: `url(${url})` }}>
                <h3>{title}</h3>
              </div>
            </figure>
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
