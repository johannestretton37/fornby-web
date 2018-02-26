import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import Gallery from '../Gallery'
import './CoursesPage.css'
import { object, string } from 'prop-types'
import CoursePage from '../CoursePage';
import CourseFilterer from '../CourseFilterer';
// import BackButton from '../BackButton/BackButton';

class CoursesPage extends Component {

  static propTypes = {
    match: object.isRequired,
    content: object.isRequired,
    title: string,
    city: object,
    rootUrl: string
  }

  static defaultProps = {
    title: ''
  }

  state = {
    // Store all categories (and courses)
    categories: [],
    // Only these filtered categories will be displayed
    filteredCategories: [],
    title: '',
    city: undefined,
  }

  componentDidMount() {
    // Init hard coded cities
    this.cities = [
      {
        title: 'Falun',
        slug: 'falun'
      },
      {
        title: 'Borlänge',
        slug: 'borlange'
      },
      {
        title: 'Ludvika',
        slug: 'ludvika'
      }
    ]
    // NOTE: - we're extracting vars from this.props.content and renaming
    //         this.props.content.courseCategories to categories
    let {city, title, content: {name, courseCategories: categories }} = this.props
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
      filteredCategories: this.filteredCourses(categories, city),
      title: pageTitle,
      city
    })
  }

  filteredCourses = (categories, city) => {
    if (city && city.slug !== '') {
      return categories.filter(category => {
        return category.courses.filter(course => {
          return course.city === city
        }).length > 0
      })
    } else {
      return categories
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category !== this.props.match.params.category) {
      // URL changed
    }
  }

  findCategory(categories, slug) {
    return categories.find(category => category.slug === slug);
  }

  RenderPage(galleryItems, field) {
    let {match, rootUrl} = this.props
    let root = rootUrl || match.url
    const { body } = field;
    return (
      <div>
        {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
        <Gallery items={galleryItems} rootUrl={root} />
      </div>);
  }

  /**
   * Filter items
   * @param {object} city - An object with two string properties, `title` and `slug`
   */
  filter = city => {
    this.setState(prevState => {
      let selectedCity
      if (prevState.city) {
        selectedCity = prevState.city.slug === city.slug ? undefined : city
      } else {
        selectedCity = city
      }
      return {
        city: selectedCity,
        filteredCategories: this.filteredCourses(prevState.categories, selectedCity)
      }
    })
  }

  render() {
    const { filteredCategories, city } = this.state;
    const { category, slug } = this.props.match.params
    let title = this.state.title;

    let content = null;
    if (slug) {
      const items = this.findCategory(filteredCategories, category)
      if (items && items.courses) {
        let course = this.findCategory(items.courses, slug);
        if (course) {
          title = null;
          content = <CoursePage content={course} onApplyChanged={() => { }} />
        }
      }
    } else if (category) {
      const items = this.findCategory(filteredCategories, category)
      if (items && items.courses) {
        title = items.name;
        content = this.RenderPage(items.courses, items);
      }
    } else if (this.props.content) {
      content = this.RenderPage(filteredCategories, this.props.content);
    }
    return (
      <div className='courses-page'>
        <Container>
          <Row>
            <Col>
            {title && <h2>{title}</h2>}
            </Col>
          </Row>
          <Row>
            <Col>
              <CourseFilterer filter={this.filter} items={this.cities || []} selection={city ? city.slug : undefined} />
            </Col>
          </Row>
          <Row>
            <Col>
              {filteredCategories.length > 0 ?
                content
              :
                <p>Det finns inga kurser att söka{city ? ' i ' + city.title : ''} för tillfället.</p>
              }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(CoursesPage)
