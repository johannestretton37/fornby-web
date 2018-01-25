import React from 'react'
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
import './Gallery.css'


Gallery.propTypes = {
  items: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
/**
 * Display an overview of an array of items
 */
function Gallery ({ items, history, match }) {
  return (
    <Row>
      {items.map((item, i) => {
        return (
          <Col xs="12" md="6" lg="4" xl="3" key={i}>
            <CSSTransition
              in={items.length > 0}
              classNames="fade"
              appear={true}
              timeout={400}
              component="li"
            >
              <Card>
                <CardImg top src={item.img || placeholderImg} alt={item.name} />
                <CardBody>
                  <CardTitle>{item.name}</CardTitle>
                  <CardSubtitle>{item.shortInfo}</CardSubtitle>
                  <CardText>Mer info...</CardText>
                  <Button
                    block
                    outline
                    color="primary"
                    onClick={() => history.push(`${match.url}/${item.slug}`)}
                  >
                    Läs mer
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



export default withRouter(Gallery)
