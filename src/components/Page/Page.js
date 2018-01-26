import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object
  }

  componentDidMount() {
    this.getContent(this.groupName(), this.props.match.params.slug)
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
      console.error(error)
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
    return (
      <div>
        <h2>{this.state.content.name}</h2>
        {this.pageType()}
      </div>
    )
  }
}

export default Page
