import React from 'react'
import { array, object } from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { withRouter } from 'react-router-dom'
import SmoothImage from '../SmoothImage'
// import placeholderImg from '../../assets/placeholderImg.svg'
import {
  Row,
  Col,
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardSubtitle,
  CardImgOverlay
} from 'reactstrap'
import './GalleryItems.css'


GalleryItems.propTypes = {
  items: array.isRequired,
  match: object.isRequired,
  history: object.isRequired
}
/**
 * Display an overview of an array of items
 */
function GalleryItems({ items = [], history }) {
  return (
    <div className="galleryItems" >

      {items.map((item, i) => {
        const src = item.images ? item.images[0].url : undefined
        const preview = item.previews ? item.previews[0] : undefined
        return (

          <CSSTransition
            in={items.length > 0}
            classNames="fade"
            appear={true}
            timeout={400}
            key={i}
            component="li"
          >
            <div className="galleryItem-container">
              <SmoothImage className='full-width' src={src} preview={preview} />


              <div className="itemInfoWrap">
                <h3>
                  {item.name}
                </h3>
                <div>
                  {item.role}
                  <br />
                  <a href={'mailto:' + item.email}>{item.email}</a>
                </div>
              </div>

              {/*
                <Card inverse id={item.slug} onClick={() => history.push(`${item.url}`)}>
                  <CardImg top width="100%" src={item.img} alt={item.name} />
                  <CardImgOverlay>
                    <CardTitle>{item.name}</CardTitle>
                    <CardSubtitle>{item.shortInfo}</CardSubtitle>
                    <CardText>{item.role}</CardText>
                  </CardImgOverlay>
                </Card>
                */}
            </div>
          </CSSTransition>

        )
      })}

    </div>
  )
}



export default withRouter(GalleryItems)
