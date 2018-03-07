import React, { Component } from 'react'
import {object} from 'prop-types'
// import {withRouter} from 'react-router-dom'
import {Transition} from 'react-transition-group'
import { Container, Row, Col } from 'reactstrap'
import SmoothImage from '../SmoothImage'
import cms from '../../cms'
import {cities} from '../../constants'
import './StartPageCarousel.css'
import StartPageCarouselItem from '../StartPageCarouselItem'
import throttle from 'lodash/throttle'

class StartPageCarousel extends Component {
  state = {
    isVisible: false,
    left: '50%',
    activeItem: 1,
    images: {},
    imageIndex: 0,
    showCityLinks: false,
    height: 400
  }

  static propTypes = {
    match: object,
    location: object,
    history: object
  }

  constructor(props) {
    super(props)
    this.throttler = throttle(this.updateImageDimensions, 1000)
  }

  componentDidMount() {
    this.update(this.props.match.params.page, this.props.match.params.subPage)
    this.findActiveItem()
    window.addEventListener('resize', this.throttler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.throttler)
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.page !== this.props.match.params.page) {
      // Default to start page '/' if city is undefined
      let pageParam = nextProps.match.params.page || 'borlange'
      this.update(pageParam, nextProps.match.params.subPage)
      this.findActiveItem(pageParam)
    }
    if (nextProps.match.params.subPage !== this.props.match.params.subPage) {
      if (nextProps.match.params.subPage) {
        // This is a subPage, hide startPageCarousel
        this.setState({
          isVisible: false
        })
      } else {
        // This is a mainPage
        let pageParam = nextProps.match.params.page || 'borlange'
        this.update(pageParam, nextProps.match.params.subPage)
        this.findActiveItem(pageParam)
      }
    }
  }
  
  update = (pageParam, subPageParam) => {
    if (subPageParam) {
      // This is a subPage, hide startPageCarousel
      this.setState({
        isVisible: false,
        showCityLinks: false
      })
      return false
    }
    let page = pageParam || 'borlange'
    this.updateImageDimensions()
    const showCityLinks = Object.values(cities).find(city => city.slug === page) !== undefined
    if (Object.keys(this.state.images).length > 0) {
      // Images are already fetched
      this.setState({
        isVisible: this.state.images[page] !== undefined,
        showCityLinks
      })
    } else {
      // Fetch images
      cms.getMainPages().then(mainPages => {
        let images = {}
        mainPages.forEach(mainPage => {
          if (mainPage.images) {
            let image = {
              src: mainPage.images[0].url,
              preview: mainPage.previews[0],
              title: mainPage.name
            }
            images[mainPage.slug] = image
          }
        })
        this.setState({
          images,
          isVisible: images[page] !== undefined,
          showCityLinks
        })
      })
    }
  }

  imageHeight = () => {
    return window.innerWidth > 600 ? 400 : 280
  }

  updateImageDimensions = () => {
    this.setState({ height: this.imageHeight() })
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

  getPageImage = page => {
    return cms.getPageContent(page)
      .then(pageContent => {
        let image = {}
        if (pageContent.images) {
          image.src = pageContent.images[0].url
          image.preview = pageContent.previews[0]
          image.title = pageContent.name
        }
        return image
      })
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
    const { isVisible, activeItem, showCityLinks, height } = this.state
    const city = this.props.match.params.page || 'borlange'
    let src, preview, title
    if (this.state.images[city]) {
      src = this.state.images[city].src
      preview = this.state.images[city].preview
      title = this.state.images[city].title
    }
    return (
      <Transition in={isVisible} timeout={300}>
        {state => {
          return (
            <div className='carousel-container' style={{
              opacity: state === 'exiting' || state === 'entering' ? 0 : 1,
              display: state === 'exited' ? 'none' : 'block',
              maxHeight: state === 'exiting' || state === 'entering' ? '0px' : '600px',
            }} >
              <SmoothImage
                id={city}
                className='full-width'
                src={src}
                preview={preview}
                height={height}>
                {!showCityLinks ? <Container>
                  <h2 className='smooth-image-title'>{title}</h2>
                </Container> : null}
              </SmoothImage>
              {showCityLinks && <div className='city-links full-width'>
                <Container>
                  <Row>             
                  {cities.map((city, i) => {
                    return (
                      <Col xs='12' md='4' key={i} className='carousel-item-container'>
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
              </div>}
            </div>
          )
        }}
        </Transition>
    )
  }
}

export default StartPageCarousel
