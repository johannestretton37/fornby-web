import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import './Gallery.css'

/**
 * Display an overview of an array of items
 */
const Gallery = ({ items, match }) => {
  return (
    <Row>
      <Col>
        <ul>
          {items.map((item, i) => {
            return (
              <CSSTransition
                in={items.length > 0}
                key={i}
                classNames="fade"
                appear={true}
                timeout={400}
                component="li"
              >
                <div>
                  <Link to={`${match.url}/${item.slug}`}>{item.name}</Link>
                  <p>{item.shortInfo}</p>
                </div>
              </CSSTransition>
            )
          })}
        </ul>
      </Col>
    </Row>
  )
}

Gallery.propTypes = {
  items: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired
}

export default withRouter(Gallery)
