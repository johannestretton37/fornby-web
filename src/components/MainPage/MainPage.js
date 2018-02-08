import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import CoursesPage from '../CoursesPage'
import Loading from '../Loading'
import PagesContainer from '../PagesContainer'
import { Container, Row, Col } from 'reactstrap'
import { ContentGroup } from '../../constants'
import SubMenu from '../SubMenu'
import ErrorPage from '../ErrorPage'
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
    match: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { page } = this.props.match.params
    if (page === ContentGroup.COURSES) {
      this.getCourses()
    } else {
      this.getPageContent(page)
    }
  }
  
  /**
   * If URL matches /kurser, get courses content
   */
  getCourses = () => {
    return new Promise(async resolve => {
      const pageContent = await cms.getCourses()
      this.setState({
        pageContent,
        isLoading: false,
        title: pageContent.name
      })
      resolve()
    })
  }

  /**
   * If URL does NOT match /kurser, get requested content
   */
  getPageContent = (page) => {
    cms.getPageContent(page)
      .then(pageContent => {
        if (Object.keys(pageContent).length === 0) throw new Error('No content found')
        this.setState({
          title: pageContent.name,
          pageContent,
          isLoading: false
        })
      })
      .catch(error => {
        this.setState({ error: error })
      })
  }

  render() {
    const { isLoading, title, pageContent, error } = this.state
    return (
      <Container>
      {isLoading ?
        <Loading />
        :
        <Row>
          <SubMenu />
          <Col>
          {error ?
            <ErrorPage error={error} />
            :
            <Switch>
              <Route path='/kurser/:category?/:slug?' render={props => <CoursesPage {...props} content={pageContent} title={title} />} />
              <Route path='/:page/:subpage?' render={props => <PagesContainer {...props } content={pageContent}/>} />
              <Route path='/:page' component={PageContainer} />
            </Switch>
          }
          </Col>
        </Row>
      }
      </Container>
    )
  }
}

export default MainPage
