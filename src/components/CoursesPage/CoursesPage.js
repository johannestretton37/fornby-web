import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import './CoursesPage.css'
import { object, string, array } from 'prop-types'
import CoursePage from '../CoursePage';
import CourseFilterer from '../CourseFilterer';
import cms from '../../cms'
import { cities } from '../../constants';
import BannerBoxContainer from '../BannerBoxContainer'
import SubMenu from '../SubMenu'
import ScrollToContent from '../ScrollToContent/ScrollToContent';
import BackButton from '../BackButton'

class CoursesPage extends Component {
  static propTypes = {
    match: object.isRequired,
    content: object.isRequired,
    title: string,
    city: string,
    subMenuItems: array
  }

  static defaultProps = {
    title: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      // Store all categories (and courses)
      categories: [],
      // Only these filtered categories will be displayed
      filteredCategories: [],
      subMenuItems: [],
      title: ''
    }
  }

  componentDidMount() {
    // NOTE: - we're extracting vars from this.props.content and renaming
    //         this.props.content.courseCategories to categories
    let { title, content: { name, courseCategories: categories }, subMenuItems, match: { params: { page } } } = this.props
    let hideFilterer = false
    switch (page) {
      case 'falun':
      case 'ludvika':
        hideFilterer = true
        cms.selectedCity = cities.find(city => city.slug === page)
        break
      default: break
    }
    // if (this.props.subMenuItems.length > 0) hideFilterer = true
    // If this.props.title has been provided, use that. Even if it's an empty string
    let pageTitle
    if (title === '') {
      pageTitle = ''
    } else {
      pageTitle = title || name
    }
    // Show only courses that matches city. If city is undefined or empty, show all courses
    this.setState({
      categories,
      filteredCategories: this.filteredCategories(categories),
      title: pageTitle,
      hideFilterer,
      subMenuItems
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category !== this.props.match.params.category) {
      // URL changed
    }
  }

  findCategory(categories, slug) {
    return categories.find(category => category.slug === slug);
  }

  filter = () => {
    this.setState({
      filteredCategories: this.filteredCategories(this.state.categories)
    })
  }

  filteredCategories = (categories) => {
    const city = cms.selectedCity
    if (city && city.slug !== '') {
      return categories.filter(category => {
        return category.courses.filter(course => {
          return course.city === city.slug
        }).length > 0
      })
    } else {
      return categories
    }
  }

  render() {
    const { filteredCategories, hideFilterer, subMenuItems } = this.state;
    const { category, slug } = this.props.match.params
    let title = this.state.title;
    let isCoursePage = false
    let content = null;
    let galleryItems, body, shortInfo, id, scrollTarget
    if (slug) {
      // This is a course page (e.g. /kurser/musikkurser/skrikkurs-vt-18)
      id = slug
      scrollTarget = slug
      isCoursePage = true
      const items = this.findCategory(filteredCategories, category)
      if (items && items.courses) {
        let course = this.findCategory(items.courses, slug);
        if (course) {
          title = null;
          content = (
            <Row>
              {subMenuItems.length > 0 &&
                <Col md={4} className='sub-menu-container'>
                  <SubMenu items={subMenuItems} />
                </Col>
              }
              <Col md={subMenuItems.length > 0 ? 8 : 12}>
                <CoursePage content={course} onApplyChanged={() => { }} />
              </Col>
            </Row>
          )
        }
      }
    } else if (category) {
      // This is a category page (e.g. /kurser/musikkurser)
      id = category
      scrollTarget = category
      const items = this.findCategory(filteredCategories, category)
      if (items && items.courses) {
        title = items.name;
        // content = this.renderPage(items.courses, items);
        galleryItems = items.courses
        body = items.body
      }
    } else if (this.props.content) {
      // This is a categories page (e.g. /kurser)
      id = this.props.content.slug + '-content'
      scrollTarget = this.props.content.slug
      // content = this.renderPage(filteredCategories, this.props.content);
      galleryItems = filteredCategories
      body = this.props.content.body
      shortInfo = !hideFilterer ? this.props.content.shortInfo : null
    }
    let filterer = (!hideFilterer && !isCoursePage) ? <CourseFilterer items={cities} filter={this.filter} /> : null
    return (
      <div id={id} className={`courses-page${hideFilterer ? ' no-bg' : ''}`}>
        <ScrollToContent id={scrollTarget} />
        <Container>
          <Row>
            <Col className='pages-container'>
              {shortInfo && <p className='short-info' dangerouslySetInnerHTML={{ __html: shortInfo }} />}
              {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
              {!isCoursePage && category &&
                <BackButton prevPage="kurser" overridePage={"/kurser"} />
              }
            </Col>
          </Row>
          {isCoursePage && content}
        </Container>

        {!isCoursePage && <Container className='full-width' fluid={true}>
          <Row>
            <Col>
              <BannerBoxContainer
                title={title}
                banners={galleryItems}
                items={galleryItems}
                filterer={filterer}
                xrootUrl={root} />
            </Col>
          </Row>
        </Container>}
      </div>
    )
  }
}

export default withRouter(CoursesPage)
