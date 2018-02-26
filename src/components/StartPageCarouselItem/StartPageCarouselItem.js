import React, { Component } from 'react'
import './StartPageCarouselItem.css'
import {object, number, bool, func} from 'prop-types'
  
class StartPageCarouselItem extends Component {
    static propTypes = {
      item: object.isRequired,
      navigate: func.isRequired,
      moveIndicator: func.isRequired,
      order: number.isRequired,
      isActive: bool,
      isLast: bool
    }
  
    static defaultProps = {
      isActive: false,
      isLast: false
    }
  
    componentDidMount() {
      if (this.props.isActive) {
        this.moveIndicator(true)
        window.addEventListener('resize', this.handleResize)
      }
    }
  
    componentWillReceiveProps(nextProps) {
      if (!nextProps.isActive && this.props.isActive) {
        // This item toggled to inactive, remove listener
        window.removeEventListener('resize', this.handleResize)
      }
      if (nextProps.isActive && !this.props.isActive) {
        // This item toggled to active, add listener
        window.addEventListener('resize', this.handleResize)
        this.moveIndicator()
      }
    }
  
    handleResize = () => {
      // TODO: Throttle this!
      this.moveIndicator(true)
    }
  
    handleClick = e => {
      e.preventDefault()
      this.moveIndicator()
      this.navigate()
    }

    leftPos = () => {
      const rect = this.link.getBoundingClientRect()
      return `${rect.left + (rect.width * 0.5)}px`
    }
    
    navigate = () => {
      const { navigate, item: { url } } = this.props
      navigate(url)
    }
  
    moveIndicator = (withOutTransition) => {
      const { order } = this.props
      const left = this.leftPos()
      if (left === '0px') {
        // If leftPos() returns '0px', update indicator next tick
        requestAnimationFrame(() => {
          this.props.moveIndicator(order, this.leftPos(), withOutTransition)
        })
      } else {
        this.props.moveIndicator(order, this.leftPos(), withOutTransition)
      }
    }
  
    render() {
      const { item, isActive, isLast } = this.props
      return (
        <a id={item.slug} ref={(link) => { this.link = link }} onClick={this.handleClick} className={`city${isLast ? ' last' : ''}${isActive ? ' active' : ''}`} href={item.url}>{item.title}</a>
      )
    }
  }
 

export default StartPageCarouselItem
