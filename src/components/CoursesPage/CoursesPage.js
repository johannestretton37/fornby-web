import React, { Component } from 'react'
import cms from '../../cms'
import { Switch, Route, withRouter } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import Gallery from '../Gallery'
import ContentGroup from '../../constants'
import './CoursesPage.css'
import { string, array, object } from 'prop-types'
import PageContainer from '../PageContainer'
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
    console.log(categories);
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
    if (this.props.match.params.category) {
      console.log(this.props.match.params.category);
    } else if (this.props.match.params.slug) {
      console.log(this.props.match.params.slug);
    } else {
      console.log(this.props.match.params);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category !== this.props.match.params.category) {
      // URL changed
    }
  }

  findCategory(categories, slug) {
    const category = categories.find(category => category.slug == slug);
    return category || null;
  }
  render() {
    const { categories } = this.state;
    const { category, slug } = this.props.match.params

    let content = null;
    if (slug) {
      const items = this.findCategory(categories, category)
      if (items && items.category) {
        let course = this.findCategory(items.category, slug);
        if (course) {
          content = <CoursePage content={course} onApplyChanged={() => { }} />
        }
      }
    } else if (category) {
      const items = this.findCategory(categories, category)
      content = items && <Gallery items={items.category} />
    } else {
      content = <Gallery items={categories} />
    }

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div style={{ textAlign: 'center' }}>
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
