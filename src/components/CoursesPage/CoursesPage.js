import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Gallery from '../Gallery'
import './CoursesPage.css'
import { string, object } from 'prop-types'
import CoursePage from '../CoursePage';

class CoursesPage extends Component {

  static propTypes = {
    match: object.isRequired,
    title: string.isRequired,
    content: object.isRequired
  }

  state = {
    categories: []
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
      categories
    })
    // const pageName = this.props.match.params.page;
    //   this.getContent();
    /*if (this.props.match.params.category) {
      console.log(this.props.match.params.category);
    } else if (this.props.match.params.slug) {
      console.log(this.props.match.params.slug);
    } else {
      console.log(this.props.match.params);
    }*/
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

    let content = null;
    if (slug) {
      const items = this.findCategory(categories, category)
      if (items && items.courses) {
        let course = this.findCategory(items.courses, slug);
        if (course) {
          content = <CoursePage content={course} onApplyChanged={() => { }} />
        }
      }
    } else if (category) {
      const items = this.findCategory(categories, category)
      content = items && this.RenderPage(items.courses, items);
    } else {
      content = this.RenderPage(categories, this.props.content);
    }

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div style={{ textAlign: 'left', borderBottom: "2px solid" }}>
                <h1>{this.props.title}</h1>
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
