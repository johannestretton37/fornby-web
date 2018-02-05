import React, { Component } from 'react'
import cms from '../../cms'
import { Switch, Route, withRouter } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import Gallery from '../Gallery'
import ContentGroup from '../../constants'
import './CoursesPage.css'
import { string, object } from 'prop-types'
import PageContainer from '../PageContainer'

class CoursesPage extends Component {
  state = {
    categories: []
  }
  static propTypes = {
    title: string.isRequired,
    match: object.isRequired
  }
  componentDidMount() {
    this.getContent();
  }

  getContent = async () => {
    const categories = await cms.getCourses();
    debugger;
    this.setState({
      categories
    })
  }
  render() {
    return (
      <div>
        <Container>
          <Switch>
            <Route
              path="/:page/:slug"
              render={props => (
                <PageContainer
                  title={this.state.title}
                  {...props}
                  items={this.state.galleryItems}
                />
              )}
            />
          </Switch>
          <Row>
            <Col>
              <div style={{ textAlign: 'center' }}>
                <h1>{this.props.title}</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Gallery items={this.state.categories} />
            </Col>
          </Row>
        </Container>

        {this.state.categories.length}
      </div>
    )
  }
}

export default CoursesPage;
