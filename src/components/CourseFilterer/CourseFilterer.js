import React, { Component } from 'react'
import {func, string, array} from 'prop-types'
import { Row, Col } from 'reactstrap'
import './CourseFilterer.css'

class CourseFilterer extends Component {

  static propTypes = {
    filter: func,
    selection: string,
    items: array
  }

  toggleCity = e => {
    let selectedId = e.currentTarget.id
    let selection = this.props.items.find(item => item.slug === selectedId)
    this.props.filter(selection)
  }

  render() {
    return (
      <Row>
        <Col>
          <div className="filterer-container">
            <div className="legend">Filtrera kurserna på ort</div>
            <div className="filterer">
              {this.props.items.map(city => {
                return (
                  <a
                    id={city.slug}
                    key={city.slug}
                    className={
                      city.slug === this.props.selection ? 'selected' : ''
                    }
                    onClick={this.toggleCity}>
                    <span>{city.title}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}

export default CourseFilterer
