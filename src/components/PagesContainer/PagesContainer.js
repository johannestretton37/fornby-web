import React, { Component } from 'react'
import { object } from 'prop-types'
import { PageSlug } from '../../constants'
import SubPage from '../SubPage'
import ErrorPage from '../ErrorPage'
import ApplyForm from '../ApplyForm'
import './PagesContainer.css'

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
    match: object.isRequired
  }

  static defaultProps = {
    content: {}
  }

  componentDidMount() {
    let { content } = this.props
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
      content: { name, shortInfo, body, error },
      subPageSlug,
      subPages
    } = this.state
    let { page } = this.props.match.params
    return (
      error ?
      <ErrorPage />
      :
      <div>
        <h2>{name}</h2>
        <p className="short-info">{shortInfo}</p>
        <p dangerouslySetInnerHTML={{ __html: body }} />
        {page === PageSlug.ANSOK ? <ApplyForm /> : null}
        {subPageSlug && subPages[subPageSlug]}
      </div>
    )
  }
}

export default PagesContainer
