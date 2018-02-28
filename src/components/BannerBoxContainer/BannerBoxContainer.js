import React, { Component } from 'react'
import './BannerBoxContainer.css'
import BannerBox from '../BannerBox'
import cms from '../../cms'
import { Container, Row, Col } from 'reactstrap'
import { array, element } from 'prop-types'

class BannerBoxContainer extends Component {
  static propTypes = {
    banners: array.isRequired,
    filterer: element
  }

  static defaultProps = {
    banners: []
  }

  render() {
    const { banners } = this.props;
    return (
      <div className='banner-boxes-container full-width'>
        {this.props.filterer && <Container>
          <Row>
            <Col>
              {this.props.filterer}
            </Col>
          </Row>
        </Container>}
        <Container className='banner-boxes'>
          <Row>
            {
              banners.length > 0 ? banners.map((banner, i) => {
                return <BannerBox key={i} content={banner} />
              })
            :
              <p style={{ paddingLeft: '1em' }}>Det finns inga kurser att söka{cms.selectedCity ? ' i ' + cms.selectedCity.title : ''} för tillfället.</p>
            }
          </Row>
        </Container>
      </div>
    )
  }
}

export default BannerBoxContainer;
