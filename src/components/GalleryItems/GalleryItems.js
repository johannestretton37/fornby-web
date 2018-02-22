import React from 'react'
import {array, string, object} from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { withRouter } from 'react-router-dom'
import SmoothImage from '../SmoothImage'
// import placeholderImg from '../../assets/placeholderImg.svg'
import {
  Row,
  Col,
  Card,
  // CardImg,
  CardTitle,
  CardText,
  CardBody,
  CardSubtitle,
  Button
} from 'reactstrap'
import './GalleryItems.css'


GalleryItems.propTypes = {
  items: array.isRequired,
  rootUrl: string,
  match: object.isRequired,
  history: object.isRequired
}
/**
 * Display an overview of an array of items
 */
function GalleryItems ({ items = [], history, match, rootUrl }) {
  return (
    <Row>
      {items.map((item, i) => {
        const src = item.images ? item.images[0].url : undefined
        const preview = item.previews ? item.previews[0] : undefined
        return (
          <Col xs="12" md="6" lg="4" xl="3" key={i}>
            <CSSTransition
              in={items.length > 0}
              classNames="fade"
              appear={true}
              timeout={400}
              component="li"
            >
              <Card id={item.slug}>
                {src && <SmoothImage src={src} preview={preview} />}
                {/* <CardImg top src={item.img || placeholderImg} alt={item.name} /> */}
                <CardBody>
                  <CardTitle>{item.name}</CardTitle>
                  <CardSubtitle>{item.shortInfo}</CardSubtitle>
                  <CardText>{item.role}</CardText>
                  <Button
                    block
                    outline
                    color="primary"
                    onClick={() => history.push(`${rootUrl ? rootUrl : match.url}/${item.slug}`)}
                  >
                    {item.cta || 'BUTTON'}
                  </Button>
                </CardBody>
              </Card>
            </CSSTransition>
          </Col>
        )
      })}
    </Row>
  )
}



export default withRouter(GalleryItems)
