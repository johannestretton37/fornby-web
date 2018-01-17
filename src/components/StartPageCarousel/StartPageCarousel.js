import React, { Component } from 'react'
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
    firstImg.src = slides[0].image
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
          src={item.image}
          alt={item.title}
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
              border: '1px solid red',
              opacity: this.state.show ? 1 : 0,
              overflow: 'hidden',
              maxHeight: this.state.show ? '300px' : '0px',
              transition: 'max-height 300ms ease-in-out, opacity 1000ms ease-out'
            }}
          >
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
                onClickHandler={this.next}
              />
            </Carousel>
          </div>
        </Col>
      </Row>
    )
  }
}

export default StartPageCarousel
