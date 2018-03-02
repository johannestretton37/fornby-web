// eslint-disable-next-line
import React, { Component } from 'react'
import {string} from 'prop-types'
import './ScrollToContent.css'
  
class ScrollToContent extends Component {
  static propTypes = {
    id: string
  }

  static defaultProps = {
    id: ''
  }

  componentDidMount() {
    this.scrollToContent()
  }

  scrollToContent = () => {
    setTimeout(() => {
      const {id} = this.props
      const scrollTarget = document.querySelector('#' + id)
      if (scrollTarget) {
        const y = document.documentElement.scrollTop + scrollTarget.getBoundingClientRect().top
        window.scroll({
          top: y, 
          left: 0, 
          behavior: 'smooth' 
        });
      }
    }, 100)
  }

  render() {
    return null
  }
}

export default ScrollToContent
