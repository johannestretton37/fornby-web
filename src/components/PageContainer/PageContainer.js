import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cms from '../../cms'
import ImagePreLoader from '../ImagePreLoader'
import './PageContainer.css'
import CoursePage from '../CoursePage'
import ErrorPage from '../ErrorPage'
import { ContentGroup } from '../../constants'
/**
 * A generic component that will display detailed information about
 * something, e.g. a course
 */
class PageContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: {},
      mainImageURL: ''
    }
  }
  static propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
  }

  componentDidMount() {
    this.getContent(this.props.match.params.page, this.props.match.params.slug)
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

  subPage = () => {
    switch (this.props.match.params.page) {
      case ContentGroup.COURSES:
        return <CoursePage content={this.state.content} mainImageURL={this.state.mainImageURL} />
      default:
        return <ErrorPage />
    }
  }

  render() {
    return (
      <div>
        <h1 className='page-title' >{this.state.content.name}</h1>
        {this.subPage()}

      </div>
    )
  }
}



export default PageContainer
