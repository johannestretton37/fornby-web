import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import Gallery from '../Gallery'
import './CoursesPage.css'
import { object, string } from 'prop-types'
import CoursePage from '../CoursePage';
import CourseFilterer from '../CourseFilterer';
import cms from '../../cms'
import { cities } from '../../constants';
import SmoothImage from '../SmoothImage';
// import BackButton from '../BackButton/BackButton';
import BannerBoxContainer from '../BannerBoxContainer'

class CoursesPage extends Component {
  static propTypes = {
    match: object.isRequired,
    content: object.isRequired,
    title: string,
    rootUrl: string
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
      title: ''
    }
  }


  componentDidMount() {
    // NOTE: - we're extracting vars from this.props.content and renaming
    //         this.props.content.courseCategories to categories
    let { title, content: { name, courseCategories: categories }, match: { params: { page } } } = this.props
    let hideFilterer = false
    switch (page) {
      case 'falun':
      case 'ludvika':
        hideFilterer = true
        cms.selectedCity = cities.find(city => city.slug === page)
        break
    }

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
      hideFilterer
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

  renderPage(galleryItems, field) {
    let { match, rootUrl } = this.props
    let root = rootUrl || match.url
    const { body } = field;
    return (
      <div>
        {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
        <BannerBoxContainer banners={galleryItems}items={galleryItems} rootUrl={root} />
      </div>);
  }

  render() {
    const { filteredCategories, hideFilterer } = this.state;
    const { category, slug } = this.props.match.params
    let title = this.state.title;
    let isCoursePage = false
    let content = null;
    let src, preview
    if (slug) {
      // This is a course page (e.g. /kurser/musikkurser/skrikkurs-vt-18)
      isCoursePage = true
      const items = this.findCategory(filteredCategories, category)
      if (items && items.courses) {
        let course = this.findCategory(items.courses, slug);
        if (course) {
          title = null;
          content = <CoursePage content={course} onApplyChanged={() => { }} />
        }
      }
    } else if (category) {
      // This is a category page (e.g. /kurser/musikkurser)
      const items = this.findCategory(filteredCategories, category)
      if (items && items.courses) {
        title = items.name;
        content = this.renderPage(items.courses, items);
      }
    } else if (this.props.content) {
      // This is a categories page (e.g. /kurser)
      content = this.renderPage(filteredCategories, this.props.content);
      src = this.props.content.images ? this.props.content.images[0].url : undefined
      preview = this.props.content.previews ? this.props.content.previews[0] : undefined
    }
    return (
      <div className='courses-page'>
        <Container fluid={true}>
          {/* <Row>
            <Col>
              <SmoothImage src={src} preview={preview} height={400}>
                {title && <h2>{title}</h2>}
                </SmoothImage>
                </Col>
              </Row> */}
          {title && <h2>{title}</h2>}
          {!hideFilterer && !isCoursePage && <Row>
            <Col>
              <CourseFilterer items={cities} filter={this.filter} />
            </Col>
          </Row>}
          <Row>
            <Col>
              {filteredCategories.length > 0 ?
                content
                :
                <p>Det finns inga kurser att söka{cms.selectedCity ? ' i ' + cms.selectedCity.title : ''} för tillfället.</p>
              }
            </Col>
          </Row>
        </Container>
        
      </div>
    )
  }
}

export default withRouter(CoursesPage)
