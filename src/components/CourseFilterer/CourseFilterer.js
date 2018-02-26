import React, { Component } from 'react'
import {func, string, array, object} from 'prop-types'
import { Row, Col } from 'reactstrap'
import cms from '../../cms'
import './CourseFilterer.css'

class CourseFilterer extends Component {
  static propTypes = {
    filter: func,
    selection: string,
    items: array
  }

  static defaultProps = {
    items: []
  }

  toggleCity = e => {
    let selectedId = e.currentTarget.id
    let selectedCity = this.props.items.find(item => item.slug === selectedId)
    if (cms.selectedCity && cms.selectedCity.slug === selectedCity.slug) {
      cms.selectedCity = undefined
    } else {
      cms.selectedCity = selectedCity
    }
    this.props.filter()
  }

  render() {
    return (
      <Row>
        <Col>
          <div className="filterer-container">
            <div className="legend">Filtrera kurserna på ort</div>
            <div className="filterer">
              {this.props.items.map(city => {
                let slug
                if (cms.selectedCity) slug = cms.selectedCity.slug
                return (
                  <a
                    id={city.slug}
                    key={city.slug}
                    className={
                      city.slug === slug ? 'selected' : ''
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
