import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import './Footer.css'

class Footer extends Component {
  render() {
    return (
      <footer>
        <Container>
          <Row>
            <Col>
              <p>Footer</p>
            </Col>
          </Row>
        </Container>
      </footer>
    )
  }
}

export default Footer
