import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { object } from 'prop-types'
import { PageSlug } from '../../constants'
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
    subMenuItems: [],
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
        // Create SubMenu
        let subMenuItems
        if (page === PageSlug.COURSES) {
          subMenuItems = this.getCoursesSubMenuItems(pageContent);
        } else if (pageContent.subPages) {
          subMenuItems = this.getSubPagesSubMenuItems(pageContent);
        }  
        this.setState({
          title: pageContent.name,
          pageContent,
          isLoading: false,
          subMenuItems
        })
      })
      .catch(error => {
        this.setState({
          error: error,
          isLoading: false
        })
      })
  }

  getCoursesSubMenuItems(pageContent) {
    let menuItems = []
    if (pageContent === undefined || !pageContent.courseCategories) return this.menuItems;
    const page = '/' + this.props.match.params.page
    pageContent.courseCategories.forEach(subpage => {
      let menuItem = {
        title: subpage.name,
        url: page + '/' + subpage.slug
      }
      if (subpage.courses) {
        subpage.courses.forEach(course => {
          let { name, slug } = course
          if (!menuItem.subItems) menuItem.subItems = []
          menuItem.subItems.push({
            title: name,
            url: page + '/' + subpage.slug + '/' + slug
          })
        })
      }
      menuItems.push(menuItem)
    })
    return menuItems;
  }

  getSubPagesSubMenuItems(pageContent) {
    let menuItems = []
    const page = '/' + this.props.match.params.page
    pageContent.subPages.forEach(subPage => {
      let menuItem = {
        title: subPage.name,
        url: page + '/' + subPage.slug
      }
      if (subPage.detailPages) {
        subPage.detailPages.forEach(detailPage => {
          let { name, slug } = detailPage.detailPage[0]
          if (!menuItem.subItems) menuItem.subItems = []
          menuItem.subItems.push({
            title: name,
            url: page + '/' + subPage.slug + '#' + slug
          })
        })
      }
      menuItems.push(menuItem)
    })
    return menuItems;
  }

  render() {
    const { isLoading, pageContent, subMenuItems, title, error } = this.state
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
            <Route path='/kurser/:category?/:slug?' render={props => {
              return (
                <CoursesPage
                  {...props}
                  title={title}
                  content={pageContent}
                  subMenuItems={subMenuItems} />
              )}
             } />
            <Route path='/:page/:subpage?' render={props => {
              return (
                <PagesContainer
                  {...props}
                  content={pageContent}
                  subMenuItems={subMenuItems} />
              )}
             } />
            <Route path='/:page' component={PageContainer} />
            <Route path='/' render={props => {
              return (
                <PagesContainer
                  {...props}
                  content={pageContent}
                  subMenuItems={subMenuItems} />
              )}
             } />
          </Switch>
        }
      </Container>
    )
  }
}

export default MainPage
