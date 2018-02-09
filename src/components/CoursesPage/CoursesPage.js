import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Gallery from '../Gallery'
import './CoursesPage.css'
import { object } from 'prop-types'
import CoursePage from '../CoursePage';
import BackButton from '../BackButton/BackButton';

class CoursesPage extends Component {

  static propTypes = {
    match: object.isRequired,
    content: object.isRequired
  }

  state = {
    categories: [],
    title: ''
  }

  componentDidMount() {
    const categories = this.props.content.courseCategory;
    let category = {};
    if (categories.category) {
      categories.category.forEach(cat => {
        category[cat.slug] = (
          <Gallery items={this.state.categories} />
        )
      })
    }
    this.setState({
      categories,
      title: this.props.content.name
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

  RenderPage(galleryItems, field) {
    const { body } = field;
    return (
      <div>
        {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
        <Gallery items={galleryItems} />
      </div>);
  }
  render() {
    const { categories } = this.state;
    const { category, slug } = this.props.match.params
    let title = this.state.title;

    let content = null;
    if (slug) {
      const items = this.findCategory(categories, category)
      if (items && items.courses) {
        let course = this.findCategory(items.courses, slug);
        if (course) {
          title = course.name;
          content = <CoursePage content={course} onApplyChanged={() => { }} />
        }
      }
    } else if (category) {
      const items = this.findCategory(categories, category)
      if (items && items.courses) {
        title = items.name;
        content = this.RenderPage(items.courses, items);
      }
    } else {
      content = this.RenderPage(categories, this.props.content);
    }

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div style={{ textAlign: 'left', borderBottom: "2px solid" }}>
                <h1>{title}</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {content}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default CoursesPage;
