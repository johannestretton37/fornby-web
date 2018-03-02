import React, { Component } from 'react'
import {string, array, object} from 'prop-types'
import { withRouter } from 'react-router-dom'
import GalleryItems from '../GalleryItems'
import './Gallery.css'


/**
 * Display a Gallery with an overview of an array of items
 */
class Gallery extends Component {
  static propTypes = {
    items: array.isRequired,
    match: object.isRequired,
    history: object.isRequired,
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items } = this.props
    const galleryItems = items.map(item => {
      if (item.images) {
        item.img = item.images[0].url
      }
      return item
    })
    return (
      <GalleryItems items={galleryItems} />
    )
  }
}

export default withRouter(Gallery)
