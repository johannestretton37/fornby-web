import React, { Component } from 'react'
import './BannerBoxContainer.css'
import BannerBox from '../BannerBox'
import { Container, Row } from 'reactstrap'
import { array } from 'prop-types'

class BannerBoxContainer extends Component {

  static propTypes = {
    banners: array.isRequired
  }

  render() {
    const { banners } = this.props;
    let contentControl = null;
    if (banners.length > 0)
      contentControl = <div className='banner-boxes-container full-width'>
        <Container className='banner-boxes'>
          <Row>
            {banners.map((banner, i) => {
              return <BannerBox key={i} content={banner} />
            })}
          </Row>
        </Container>
      </div>

    return contentControl;
  }
}

export default BannerBoxContainer;
