import React, { Component } from 'react'
import { object, array } from 'prop-types'
import { PageSlug, cities } from '../../constants'
import SubPage from '../SubPage'
import ErrorPage from '../ErrorPage'
import CoursesPage from '../CoursesPage'
import ApplyForm from '../ApplyForm'
import cms from '../../cms'
import './PagesContainer.css'
import SubMenu from '../SubMenu'
import { Container, Row, Col } from 'reactstrap'

/**
 * PagesContainer
 *
 * PagesContainer renders a `MainPage`, which in turn renders
 * a list of `SubPage`s (if available). `SubPage` will render
 * a list of `DetailPage`s (if available).
 */
class PagesContainer extends Component {
  state = {
    content: this.props.content,
    subPages: {},
    subPageSlug: this.props.match.params.subpage
  }

  static propTypes = {
    content: object.isRequired,
    match: object.isRequired,
    subMenuItems: array
  }

  static defaultProps = {
    content: {},
    subMenuItems: []
  }

  componentDidMount() {
    let { content, match: { params: { page } } } = this.props
    switch (page) {
      case 'falun':
      case 'ludvika':
        cms.selectedCity = cities.find(city => city.slug === page)
      break
      default: break
    }
    if (content.subPages) {
      // Map subPages by slug
      let subPages = {}
      let subPageSlug
      content.subPages.forEach(subPageContent => {
        if (subPageContent.showByDefault) {
          // Sanity check
          if (subPageSlug) {
            console.error(
              `Multiple SubPages are set to showByDefault. '${subPageSlug}', '${
              subPageContent.slug
              }' found. Please edit this in flamelink cms.`
            )
          }
          subPageSlug = subPageContent.slug
        }
        subPages[subPageContent.slug] = (
          <SubPage content={subPageContent} url={this.props.match.url} />
        )
      })
      if (!subPageSlug) subPageSlug = this.props.match.params.subpage
      this.setState({ content, subPageSlug, subPages })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.subpage !== this.props.match.params.subpage) {
      // Url changed
      this.setState({
        subPageSlug: nextProps.match.params.subpage
      })
    }
  }

  render() {
    const {
      content,
      content: { name, shortInfo, body, error },
      subPageSlug,
      subPages
    } = this.state
    let { subMenuItems, match: { params: { page } } } = this.props
    return (
      <Container>
        <Row>
        {subMenuItems.length > 0 && 
          <Col md={4} className='sub-menu-container'>
            <SubMenu items={subMenuItems} />
          </Col>
        }
          <Col md={subMenuItems.length > 0 ? 8 : 12}>
            {error ?
              <ErrorPage error={error} />
              :
              <div className={`${page ? page + ' ' : ''}pages-container`}>
                <h2>{name}</h2>
                <p className="short-info">{shortInfo}</p>
                <p dangerouslySetInnerHTML={{ __html: body }} />
                {page === PageSlug.ANSOK ? <ApplyForm /> : null}
                {subPageSlug && subPages[subPageSlug]}
                {content.courseCategories && <CoursesPage title='' subMenuItems={subMenuItems} content={content} />}
              </div>
            }
          </Col>
        </Row>
      </Container>
    )
  }
}

export default PagesContainer
