import React, { Component } from 'react'
import { Switch, Link, Route, withRouter } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { Container, Row, Col } from 'reactstrap'
import Gallery from '../Gallery'
import Page from '../Page'
import cms from '../../cms'
import './GalleryPage.css'

/**
 * GalleryPage keeps track of what content to display
 * It renders a `Gallery` component which then displays the content
 */
class GalleryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      galleryItems: []
    }
  }

  componentDidMount() {
    this.getContent(this.props.contentType)
  }

  getContent = async contentType => {
    // Get content
    const content = await cms.getContentGroup(contentType)
    this.setState({
      galleryItems: content
    })
  }

  render() {
    const { title } = this.props
    return (
      <section>
        <Container>
          <Switch>
            <Route path="/:page/:slug" component={Page} />
            <Route
              render={() => {
                return (
                  <div>
                    <Row>
                      <Col>
                        <h2>{title}</h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Gallery items={this.state.galleryItems} />
                      </Col>
                    </Row>
                  </div>
                )
              }}
            />
          </Switch>
        </Container>
      </section>
    )
  }
}

GalleryPage.defaultProps = {
  title: 'Kurser',
  contentType: 'kurser'
}

export default withRouter(GalleryPage)