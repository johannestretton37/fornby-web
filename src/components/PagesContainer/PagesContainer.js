import React, { Component } from 'react'
import { object } from 'prop-types'
import cms from '../../cms'
import { PageSlug } from '../../constants'
import { CSSTransition } from 'react-transition-group'
import SubPage from '../SubPage'
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
  static propTypes = {
    match: object.isRequired
  }

  state = {
    content: {},
    subPages: {},
    subPageSlug: this.props.match.params.subpage
  }

  componentDidMount() {
    const pageName = this.props.match.params.page
    cms.getPageContent(pageName).then(content => {
      let subPages = {}
      let subPageSlug
      if (content.subPages) {
        content.subPages.forEach(subPageContent => {
          if (subPageContent.showByDefault) {
            // Sanity check
            if (subPageSlug) console.error(`Multiple SubPages are set to showByDefault. '${subPageSlug}', '${subPageContent.slug}' found`)
            subPageSlug = subPageContent.slug
          }
          subPages[subPageContent.slug] = (
            <SubPage content={subPageContent} url={this.props.match.url} />
          )
        })
      }
      if (Object.keys(content).length === 0) {
        content = {
          name: '404 ' + pageName,
          shortInfo: 'Här finns ingenting.'
        }
      }
      if (!subPageSlug) subPageSlug = this.props.match.params.subpage
      this.setState({ content, subPageSlug, subPages })
    })
  }

  render() {
    const { content, content: { name, shortInfo, body }, subPageSlug, subPages } = this.state
    let { page } = this.props.match.params
    return (
      // <CSSTransition
      //   in={Object.keys(content).length > 0}
      //   classNames="fade"
      //   appear={true}
      //   timeout={400}>
        <div>
          <h2>{name}</h2>
          <p className="short-info">{shortInfo}</p>
          <p dangerouslySetInnerHTML={{ __html: body }} />
          {page === PageSlug.ANSOK ? <ApplyForm /> : null}
          {subPageSlug && subPages[subPageSlug]}
        </div>
      // </CSSTransition>
    )
  }
}

export default PagesContainer
