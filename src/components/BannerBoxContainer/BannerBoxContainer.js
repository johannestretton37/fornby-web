import React, { Component } from 'react'
import './BannerBoxContainer.css'
import BannerBox from '../BannerBox'
import { Container, Row, Col } from 'reactstrap'
import { array, element } from 'prop-types'

class BannerBoxContainer extends Component {
  static propTypes = {
    banners: array.isRequired,
    top: element
  }

  static defaultProps = {
    banners: []
  }

  render() {
    const { banners } = this.props;
    return banners.length > 0 ?
      <div className='banner-boxes-container full-width'>
        {this.props.top && <Container>
          <Row>
            <Col>
              {this.props.top}
            </Col>
          </Row>
        </Container>}
        <Container className='banner-boxes'>
          <Row>
            {banners.map((banner, i) => {
              return <BannerBox key={i} content={banner} />
            })}
          </Row>
        </Container>
      </div>
    : null
  }
}

export default BannerBoxContainer;
