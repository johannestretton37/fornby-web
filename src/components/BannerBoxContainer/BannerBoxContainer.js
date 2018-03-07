import React, { Component } from 'react'
import './BannerBoxContainer.css'
import BannerBox from '../BannerBox'
import cms from '../../cms'
import { Container, Row, Col } from 'reactstrap'
import { array, element, string } from 'prop-types'

class BannerBoxContainer extends Component {
  static propTypes = {
    banners: array.isRequired,
    filterer: element,
    title: string
  }

  static defaultProps = {
    banners: [],
    title: ''
  }

  render() {
    const { banners, title } = this.props;
    // A somewhat hacky solution to pluralize course name
    let pluralizedCourses = title.toLowerCase() || 'kurser'
    if (!pluralizedCourses.endsWith('kurser')) pluralizedCourses += '-kurser'
    return (
      <div className='banner-boxes-container full-width' style={banners.length > 0 ? {
        padding: '1em 0',
        minHeight: '400px'
      } : {}}>
        {this.props.title && <Container>
          <Row>
            <Col>
              <h3>{this.props.title}</h3>
            </Col>
          </Row>
        </Container>}
        {this.props.filterer && <Container style={{padding: '0'}}>
          {this.props.filterer}
        </Container>}
        <Container className='banner-boxes'>
          <Row style={{flexGrow: '1'}}>
            {
              banners.length > 0 ? banners.map((banner, i) => {
                return <BannerBox key={i} content={banner} />
              })
            :
              this.props.filterer && <p style={{ marginTop: '2em', textAlign: 'center', flexGrow: '1' }}>Det finns inga {pluralizedCourses} att söka{cms.selectedCity ? ' i ' + cms.selectedCity.title : ''} för tillfället.</p>
            }
          </Row>
        </Container>
      </div>
    )
  }
}

export default BannerBoxContainer;
