import React from 'react'
import { array, object } from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import logoWhite from '../../assets/logoWhite.svg'
import './Footer.css'

const Footer = ({ navLinks = [], location }) => {
  console.log(navLinks)
  return (
    <footer>
      <Container>
        <Row>
          <Col md='4' xs='12'>
            <h5>Hitta rätt på sidan</h5>
            <nav>
              <ul>
              {navLinks.map((navLink, i) => (
                <li key={i} className={navLink.url === location.pathname ? 'active' : 'enabled'}>
                  <Link to={navLink.url}>{navLink.title}</Link>
                </li>
              ))}
              </ul>
            </nav>
          </Col>
          <Col md='4' xs='12'>
            <h5>Kontakta oss</h5>
            <p><b>Fornby folkhögskola</b><br/>
              Borlänge
            </p>
            <p>
              Box 5016<br />
              781 05 Borlänge<br />
              Tel: <a href="tel:0243239550">0243-23 95 50</a>
              <br />
              Epost: <a href="mailto:info@fornby.se">info@fornby.se</a>
            </p>
          </Col>
          <Col md='4' xs='12'>
            <Row>
              <Col xs='12' style={{ paddingBottom: '2em' }}>
                <h5>Följ oss på sociala medier</h5>
                <ul className='social'>
                  <li><a className='facebook' href='https://www.facebook.com/fornby'>facebook</a></li>
                  <li><a className='twitter' href='https://twitter.com/Fornbyfhsk'>twitter</a></li>
                </ul>
              </Col>
              <Col xs='12'>
                <h5>Hitta hit</h5>
                <p><a target='_blank' rel='noopener noreferrer' href='https://goo.gl/maps/t8wtUCcv5vx'>Öppna karta i Google Maps</a></p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className='footer-bottom'>
        <a href='/' className='logo' >
          <img alt='Fornby Folkhögskola' src={logoWhite} />
        </a>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  navLinks: array,
  location: object
}

export default Footer
