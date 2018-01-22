import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import StartPageCarousel from '../StartPageCarousel'
import BannerBox from '../BannerBox'
import './StartPage.css'

class StartPage extends Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div style={{ textAlign: 'center' }}>
                <h1>Välkommen!</h1>
                <p>Detta är startsidan</p>
              </div>
            </Col>
          </Row>
        </Container>
        <StartPageCarousel />
        <Container>
          <Row>
            {this.props.content.boxes.map((contentBox, i) => {
              return <BannerBox key={i} content={contentBox} />
            })}
          </Row>
        </Container>
      </div>
    )
  }
}

StartPage.propTypes = {
  content: PropTypes.object
}

StartPage.defaultProps = {
  content: {
    boxes: [
      {
        heading: 'Heading 1',
        body: 'Body 1',
        btnText: 'Ansök nu'
      },
      {
        heading: 'Heading 2',
        body: 'Body 2',
        btnText: 'Ansök nu'
      },
      {
        heading: 'Heading 3',
        body: 'Body 3',
        btnText: 'Ansök nu'
      }
    ]
  }
}

export default StartPage