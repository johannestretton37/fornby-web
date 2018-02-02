import React, { Component } from 'react'
import { object } from 'prop-types'
import cms from '../../cms'
import { PageSlug } from '../../constants'
import { CSSTransition } from 'react-transition-group'
import SubPage from '../SubPage'
import ApplyForm from '../ApplyForm'
import './PagesContainer.css'

class PagesContainer extends Component {
  static propTypes = {
    match: object.isRequired
  }

  state = {
    content: {},
    subPages: {}
  }

  componentDidMount() {
    const pageName = this.props.match.params.page
    cms.getPageContent(pageName).then(content => {
      let subPages = {}
      if (content.subPages) {
        content.subPages.forEach(subPageContent => {
          subPages[subPageContent.slug] = (
            <SubPage content={subPageContent} url={this.props.match.url} />
          )
        })
      }
      this.setState({ content, subPages })
    })
  }

  render() {
    const { content, content: { name, shortInfo, body }, subPages } = this.state
    // NOTE: - We're renaming subpage to subPage while destructuring
    const { page, subpage: subPage } = this.props.match.params
    return (
      <CSSTransition
        in={Object.keys(content).length > 0}
        classNames="fade"
        appear={true}
        timeout={400}>
        <div>
          <h2>{name}</h2>
          <p className="short-info">{shortInfo}</p>
          <p dangerouslySetInnerHTML={{ __html: body }} />
          {page === PageSlug.ANSOK ? <ApplyForm /> : null}
          {subPage && subPages[subPage]}
        </div>
      </CSSTransition>
    )
  }
}

export default PagesContainer
