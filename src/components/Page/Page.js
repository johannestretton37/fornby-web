import React, { Component } from 'react'
import { string, object, array } from 'prop-types'
import BackButton from '../BackButton'
import cms from '../../cms'
import './Page.css'
import ErrorPage from '../ErrorPage'
import { pageTypes } from '../../constants'
import { camelCase } from '../../Helpers'
/**
 * A generic component that will display detailed information about
 * something, e.g. a course
 */
class Page extends Component {
  state = {
    content: {},
    mainImageURL: ''
  }

  static propTypes = {
    items: array,
    title: string,
    location: object,
    match: object,
    history: object
  }

  componentWillReceiveProps(nextProps) {
    let content = nextProps.items.find(item => item.slug === nextProps.match.params.slug)
    if (content) {
      this.setState({content})
      if (content.mainImage) {
        cms.getURL(content.mainImage[0]).then(mainImageURL => {
          this.setState({ mainImageURL })
        })
      }
    }
  }

  getContent = async (group, id) => {
      try {
        let content = await cms.getContent(group, id)
        this.setState({ content })
        if (content.mainImage) {
          let mainImageURL = await cms.getURL(content.mainImage[0])
          this.setState({ mainImageURL })
        }
      } catch (error) {
        const parentPath = this.props.location.pathname.replace(`/${id}`, '')
        this.props.history.push(parentPath)
      }
  }

  groupName = () => {
    return camelCase(this.props.match.params.page)
  }

  pageType = () => {
    const PageType = pageTypes[this.groupName()] || ErrorPage
    const { content, mainImageURL } = this.state
    return <PageType content={content} mainImageURL={mainImageURL} />
  }

  render() {
    const PageType = pageTypes[this.groupName()] || ErrorPage
    const { content, mainImageURL } = this.state
    let pageType = <PageType content={content} mainImageURL={mainImageURL} />
    return (
      <div>
        <BackButton prevPage={this.props.title} />
        <h2>{this.state.content.name}</h2>
        {pageType}
      </div>
    )
  }
}

export default Page
