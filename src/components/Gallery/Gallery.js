import React, { Component } from 'react'
import {string, array, object} from 'prop-types'
import { withRouter } from 'react-router-dom'
import GalleryItems from '../GalleryItems'
import './Gallery.css'


/**
 * Display a Gallery with an overview of an array of items
 * @param {string?} rootUrl - Pass a string that serves as the root url for displayed items, e.g. '/kurser' (optional)
 */
class Gallery extends Component {
  static propTypes = {
    items: array.isRequired,
    match: object.isRequired,
    history: object.isRequired,
    rootUrl: string
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items, rootUrl } = this.props
    const galleryItems = items.map(item => {
      if (item.images) {
        item.img = item.images[0].url
      }
      return item
    })
    return (
      <GalleryItems items={galleryItems} rootUrl={rootUrl} />
    )
  }
}

export default withRouter(Gallery)
