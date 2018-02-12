import React, { Component } from 'react'
import {object} from 'prop-types'
import {Link} from 'react-router-dom'
import {Transition} from 'react-transition-group'
import { Container, Row, Col } from 'reactstrap'
import heroImg from '../../assets/heroImg.jpg'
import Image from '../Image'
import cms from '../../cms'
import './StartPageCarousel.css'

class StartPageCarousel extends Component {
  state = {
    isVisible: false,
    left: '50%'
  }

  static propTypes = {
    match: object
  }

  componentDidMount() {
    this.update()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.city !== this.props.match.params.city) {
      let cityParam = nextProps.match.params.city || '/'
      this.update(cityParam)
    }
  }
  
  update = (cityParam) => {
    const city = cityParam || this.props.match.params.city
    switch (city) {
      case 'ludvika':
      case 'falun':
        this.getPageContent(city)
        this.setState({
          isVisible: true
        })
      break
      case '/': 
      case undefined:
        this.setState({
          left: '50%',
          isVisible: true
        })
      break
      default: 
        this.setState({ isVisible: false })
      break
    }
  }

  getPageContent = (page) => {
    cms.getPageContent(page)
      .then(pageContent => {
        this.setState({ pageContent })
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleClick = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    this.setState({
      left: `${rect.left + (rect.width * 0.5)}px`
    })
  }

  render() {
    // if (!this.state.isVisible) return null
    const cities = [
      {
        id: 'falun',
        title: 'FALUN',
        url: '/falun'
      },
      {
        id: 'borlange',
        title: 'BORLÄNGE',
        url: '/'
      },
      {
        id: 'ludvika',
        title: 'LUDVIKA',
        url: '/ludvika'
      },
    ]
    return (
      <Transition in={this.state.isVisible} timeout={300}>
        {state => {
          return (
            <div className='carousel-container' style={{
              opacity: state === 'exiting' || state === 'entering' ? 0 : 1,
              display: state === 'exited' ? 'none' : 'block',
              maxHeight: state === 'exiting' ? '0px' : '600px',
            }} >
              <Image className='full-width' src={heroImg} height={400} />
              <div className='city-links full-width'>
                <Container>
                  <Row>             
                  {cities.map((city, i) => {
                    return (
                      <Col xs='12' md='4' key={i}>
                        <Link id={city.id} onClick={this.handleClick} className={`city${i === cities.length - 1 ? ' last' : ''}`} to={city.url}>{city.title}</Link>
                      </Col>
                    )
                  })}
                  </Row>
                  <div id='city-indicator' style={{ left: this.state.left }} ></div>
                </Container>
              </div>
            </div>
          )
        }}
        </Transition>
    )
  }
}

export default StartPageCarousel
