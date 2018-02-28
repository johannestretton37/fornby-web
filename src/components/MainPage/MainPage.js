import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { object, bool } from 'prop-types'
import CoursesPage from '../CoursesPage'
import Loading from '../Loading'
import PagesContainer from '../PagesContainer'
import { Container, Row, Col } from 'reactstrap'
import ErrorPage from '../ErrorPage'
import CustomError from '../../models/CustomError'
import cms from '../../cms'
import './MainPage.css'
import PageContainer from '../PageContainer/PageContainer'

/**
 * MainPage
 * 
 * MainPage will fetch content from cms and render a PagesContainer,
 * CoursesPage or similar. All content that matches `this.props.match.params.page`
 * will be fetched
 */
class MainPage extends Component {
  state = {
    isLoading: true,
    pageContent: {},
    title: '',
    error: null
  }

  static propTypes = {
    match: object.isRequired,
  }

  static defaultProps = {
  }

  componentDidMount() {
    const page = this.props.match.params.page || 'borlange'
    this.getPageContent(page)
  }

  /**
   * Get requested content
   */
  getPageContent = (page) => {
    cms.getPageContent(page)
      .then(pageContent => {
        if (Object.keys(pageContent).length === 0) throw new CustomError(
          'Oj, här var det tomt',
          'Vi kunde inte hitta något här.',
          true
        )
        this.setState({
          title: pageContent.name,
          pageContent,
          isLoading: false
        })
      })
      .catch(error => {
        this.setState({
          error: error,
          isLoading: false
        })
      })
  }

  render() {
    const { isLoading, pageContent, title, error } = this.state
    return (
      <Container className='full-width' fluid={true}>
        {isLoading ?
          <Loading />
          :
        error ?
          <Container>
            <Row>
              <Col>
                <ErrorPage error={error} />
              </Col>
            </Row>
          </Container>
          :
          <Switch>
            <Route path='/kurser/:category?/:slug?' render={props => <CoursesPage {...props} title={title} content={pageContent} />} />
            <Route path='/:page/:subpage?' render={props => <PagesContainer {...props} content={pageContent} rootUrl={'/kurser'} />} />
            <Route path='/:page' component={PageContainer} />
            <Route path='/' render={props => <PagesContainer {...props} content={pageContent} />} />
          </Switch>
        }
      </Container>
    )
  }
}

export default MainPage
