import React, { Component } from 'react'
import { Col, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import './BannerBox.css'

class BannerBox extends Component {
  render() {
    const { content } = this.props
    return (
      <Col xs="12" md="6" lg="4" className='banner-box'>
        <img src={content.src} className="rounded-circle" />
        <h2>{content.heading}</h2>
        <p>{content.body}</p>
        <Button>{content.btnText}</Button>
      </Col>
    )
  }
}

BannerBox.propTypes = {
  content: PropTypes.object.isRequired
}

export default BannerBox
