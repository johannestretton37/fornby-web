import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import CoursesPage from '../CoursesPage'
import Loading from '../Loading'
import PagesContainer from '../PagesContainer'
import { Container, Row, Col } from 'reactstrap'
import { ContentGroup } from '../../constants'
import SubMenu from '../SubMenu'
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
    title: ''
  }

  static propTypes = {
    match: PropTypes.object.isRequired
  }

  componentDidMount() {
    const page = this.props.match.params.page
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
        title: 'Kurser',
        isLoading: false
      })
      resolve()
    })
  }

  getPageContent = (page) => {
    return new Promise(async resolve => {
      const pageContent = await cms.getPageContent(page)
      if (Object.keys(pageContent).length === 0) {
        this.setState({
          pageContent: {
            error: true
          },
          isLoading: false
        })
      } else {
        this.setState({
          title: pageContent.name,
          pageContent,
          isLoading: false
        })
      }
      resolve()
    })
  }

  render() {
    const { isLoading, title, pageContent } = this.state
    return (
      <Container>
      {isLoading ?
        <Loading />
        :
        <Row>
          <SubMenu />
          <Col>
              <Switch>
                <Route path='/kurser/:category?/:slug?' render={props => <CoursesPage {...props} content={pageContent} title={title} />} />
                <Route path='/:page/:subpage?' render={props => <PagesContainer {...props } content={pageContent}/>} />
                <Route path='/:page' component={PageContainer} />
              </Switch>
          </Col>
        </Row>
      }
      </Container>
    )
  }
}

export default MainPage
