import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { withRouter } from 'react-router-dom'
import placeholderImg from '../../assets/placeholderImg.svg'
import {
  Row,
  Col,
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
  CardSubtitle,
  Button
} from 'reactstrap'
import GalleryItems from '../GalleryItems'
import './Gallery.css'


/**
 * Display a Gallery with an overview of an array of items
 */
class Gallery extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items } = this.props
    const galleryItems = items.map(item => {
      if (item.portrait) {
        item.img = item.portrait[0].url
      }
      return item
    })
    return (
      <GalleryItems items={galleryItems} />
    )
  }
}



export default withRouter(Gallery)
