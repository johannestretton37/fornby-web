import React, { Component } from 'react'
import { object, array } from 'prop-types'
import { PageSlug, cities, ContentGroup } from '../../constants'
import SubPage from '../SubPage'
import ErrorPage from '../ErrorPage'
import CoursesPage from '../CoursesPage'
import ApplyForm from '../ApplyForm'
import cms from '../../cms'
import './PagesContainer.css'
import SubMenu from '../SubMenu'
import SubMenuMobile from '../SubMenu/SubMenuMobile'
import { Container, Row, Col } from 'reactstrap'
import SmoothImage from '../SmoothImage'

/**
 * PagesContainer
 *
 * PagesContainer renders a `MainPage`, which in turn renders
 * a list of `SubPage`s (if available). `SubPage` will render
 * a list of `DetailPage`s (if available).
 */
class PagesContainer extends Component {
  state = {
    data: {},
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
  findCategory(categories, slug) {
    return categories.find(category => category.slug === slug);
  }
  componentDidMount() {
    let {
      content,
      match: {
        params: { page, subpage, detailslug }
      }
    } = this.props
    let { data } = this.state;
    switch (page) {
      case 'falun':
      case 'ludvika':
        cms.selectedCity = cities.find(city => city.slug === page)
        break
      default:
        break
    }
    this.setState({ data: content });
    if (detailslug) {
      let s = content.subPages.find(sub => sub.slug === subpage);
      if (s && s.detailPages) {
        let a = s.detailPages.find(sub => sub.detailPage[0].slug === detailslug);
        if (a) {
          console.log("Wosan", a.detailPage[0])
          this.setState({ data: a.detailPage[0] })
        }
      }
    } else if (subpage) {
      let s = content.subPages.find(sub => sub.slug === subpage);
      if (s) {
        this.setState({ data: s })
        console.log("Nej nu, r", s);
      }
    } else {
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
    const { data,
      data: { name, shortInfo, body, error, images, previews },
    } = this.state
    let {
      subMenuItems,
      match: {
        params: { page, subpage }
      }
    } = this.props
    const src = subpage ? images ? images[0].url : undefined : undefined;
    const preview = previews ? previews[0] : undefined;
    return (
      <React.Fragment>
        {src && <SmoothImage className='full-width' height={400} src={src} preview={preview} />}
        <Container>
          <Row>
            {subMenuItems.length > 0 && (
              <Col md={4} className="sub-menu-container">
                <SubMenu items={subMenuItems} />
                <SubMenuMobile items={subMenuItems} />}
              </Col>
            )}
            <Col md={subMenuItems.length > 0 ? 8 : 12}>
              {error ? (
                <ErrorPage error={error} />
              ) : (
                  <div className={`${page ? page + ' ' : ''} pages-container`}>
                    <SubPage content={data} />
                    {page === PageSlug.ANSOK ? <ApplyForm /> : null}
                  </div>
                )}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default PagesContainer
