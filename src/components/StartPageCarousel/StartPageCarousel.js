import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap'
import cms from '../../cms'
import './StartPageCarousel.css'

class StartPageCarousel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      activeIndex: 0,
      show: false
    }
  }
  static propTypes = {
    height: PropTypes.number
  }
  static defaultProps = {
    height: 400
  }

  componentDidMount() {
    this.getSlides()
  }

  getSlides = async () => {
    const slides = await cms.getSlides()
    // Wait until browser has loaded the first image,
    // then show carousel
    let firstImg = new Image()
    firstImg.onload = () => {
      this.setState({ show: true })
    }
    firstImg.src = slides[0].image[0].url
    // Load all slides
    this.setState({
      items: slides
    })
  }

  onExiting = () => {
    this.animating = true
  }

  onExited = () => {
    this.animating = false
  }

  next = () => {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  previous = () => {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  goToIndex = newIndex => {
    if (this.animating) return
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    const slides = this.state.items.map((item, i) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={i}
          src={item.image[0].url}
          alt={item.alt}
        >
          <CarouselCaption
            captionText={item.subtitle}
            captionHeader={item.title}
          />
        </CarouselItem>
      )
    })

    return (
      <Row>
        <Col>
          <div
            style={{
              opacity: this.state.show ? 1 : 0,
              filter: this.state.show ? 'blur(0px)' : 'blur(4px)',
              overflow: 'hidden',
              maxHeight: this.state.show ? this.props.height + 'px' : '0px',
              transition:
                'max-height 300ms ease-in-out, opacity 1000ms ease-out, filter 1000ms ease-out'
            }} >
            <Carousel
              activeIndex={activeIndex}
              next={this.next}
              previous={this.previous}
            >
              <CarouselIndicators
                items={this.state.items}
                activeIndex={activeIndex}
                onClickHandler={this.goToIndex}
              />
              {slides}
              <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={this.previous}
              />
              <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={this.next} />
            </Carousel>
          </div>
        </Col>
      </Row>
    )
  }
}



export default StartPageCarousel
