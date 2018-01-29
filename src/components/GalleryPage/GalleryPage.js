import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import Gallery from '../Gallery'
import PageContainer from '../PageContainer'
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
  static propTypes = {
    title: PropTypes.string.isRequired,
    contentType: PropTypes.string.isRequired
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
            <Route path="/:page/:slug" component={PageContainer} />
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



export default withRouter(GalleryPage)
