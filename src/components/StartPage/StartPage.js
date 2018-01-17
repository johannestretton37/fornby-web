import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import StartPageCarousel from '../StartPageCarousel'
import './StartPage.css'

class StartPage extends Component {
  render() {
    return (
      <Container>
        <StartPageCarousel />
        <Row>
          <Col>
            <div style={{ textAlign: 'center' }}>
              <h1>Välkommen!</h1>
              <p>Detta är startsidan</p>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default StartPage
