import React, { Component } from 'react'
import { object } from 'prop-types'
import cms from '../../cms'
import SubPage from '../SubPage'
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
    cms.getPageContent(pageName)
    .then(content => {
      let subPages = {}
      if (content.subPages) {
        content.subPages.map(subPageContent => {
          subPages[subPageContent.slug] = <SubPage content={subPageContent} url={this.props.match.url} />
        })
      }
      this.setState({ content, subPages })
    })
  }
  
  render() {
    const { content: { name, shortInfo, body }, subPages } = this.state
    const subPage = this.props.match.params.subpage
    return (
      <div style={{ border: '3px double green', padding: '3px' }}>
      <p style={{ color: 'green' }}>PagesContainer</p>
        <h3>{name}</h3>
        <p>{shortInfo}</p>
        <p dangerouslySetInnerHTML={{ __html: body }} />
        {subPage && subPages[subPage] }
      </div>
    )
  }
}

export default PagesContainer
