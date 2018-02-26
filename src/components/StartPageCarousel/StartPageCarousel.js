import React, { Component } from 'react'
import {object, array} from 'prop-types'
// import {withRouter} from 'react-router-dom'
import {Transition} from 'react-transition-group'
import { Container, Row, Col } from 'reactstrap'
import SmoothImage from '../SmoothImage'
import cms from '../../cms'
import {cities} from '../../constants'
import './StartPageCarousel.css'
import StartPageCarouselItem from '../StartPageCarouselItem'

class StartPageCarousel extends Component {
  state = {
    isVisible: false,
    left: '50%',
    activeItem: 1,
    images: [],
    imageIndex: 0
  }

  static propTypes = {
    match: object,
    location: object,
    history: object,
    items: array
  }

  static defaultProps = {
    items: []
  }

  componentDidMount() {
    cms.getSlides().then(startPageSlides => {
      const images = startPageSlides.map(slide => {
        if (!slide.images) return null
        const src = slide.images[0].url
        const preview = slide.previews ? slide.previews[0] : undefined
        return {
          src,
          preview
        }
      })
      this.setState({
        images,
        imageIndex: 0
      })
    })
    this.update()
    this.findActiveItem()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.city !== this.props.match.params.city) {
      // Default to start page '/' if city is undefined
      let cityParam = nextProps.match.params.city || '/'
      this.update(cityParam)
      this.findActiveItem(cityParam)
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
      case 'borlange': 
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

  findActiveItem = (pageSlug) => {
    const { location } = this.props
    const mainPath = pageSlug || location.pathname.split('/')[1]
    let activeItem = cities.findIndex(
      item => item.url === '/' + mainPath
    )
    // Default to start page if no match is found
    if (activeItem === -1 || activeItem === undefined) activeItem = 1
    this.setState({
      activeItem
    })
  }

  moveIndicator = (activeItem, indicatorPosition, withOutTransition) => {
    if (this.activeIndicator && withOutTransition) {
      if (this.activeIndicator.style.transition !== 'none') {
        this.indicatorTransition = this.activeIndicator.style.transition
      }
      this.activeIndicator.style.transition = 'none'
      setTimeout(() => {
        this.activeIndicator.style.transition = this.indicatorTransition
      }, 100)
    }
    this.setState({
      activeItem,
      left: indicatorPosition
    })
  }

  navigate = href => {
    let { location, history } = this.props
    if (href !== location.pathname) {
      history.push(href)
    }
  }

  getPageContent = (page) => {
    cms.getPageContent(page)
      .then(pageContent => {
        this.setState({
          pageContent
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    // if (!this.state.isVisible) return null
    const { isVisible, activeItem, images, imageIndex } = this.state
    return (
      <Transition in={isVisible} timeout={300}>
        {state => {
          return (
            <div className='carousel-container' style={{
              opacity: state === 'exiting' || state === 'entering' ? 0 : 1,
              display: state === 'exited' ? 'none' : 'block',
              maxHeight: state === 'exiting' ? '0px' : '600px',
            }} >
              <SmoothImage className='full-width' src={images[imageIndex] ? images[imageIndex].src : ''} preview={images[imageIndex] ? images[imageIndex].preview : undefined} height={400} />
              <div className='city-links full-width'>
                <Container>
                  <Row>             
                  {cities.map((city, i) => {
                    return (
                      <Col xs='12' md='4' key={i}>
                        <StartPageCarouselItem
                          item={city}
                          order={i}
                          navigate={this.navigate}
                          moveIndicator={this.moveIndicator}
                          isActive={activeItem === i}
                          isLast={i === cities.length - 1} />
                      </Col>
                    )
                  })}
                  </Row>
                  <div id='city-indicator' ref={activeIndicator => { this.activeIndicator = activeIndicator }} style={{ left: this.state.left }} ></div>
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
