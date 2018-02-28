import React, { Component } from 'react'
import { string } from 'prop-types'
import { Route } from 'react-router-dom'
import { Container, Row } from 'reactstrap'
import { ContentGroup, defaultFields } from '../../constants'
import MainPage from '../MainPage'
import cms from '../../cms'
import './StartPage.css'
import BannerBoxContainer from '../BannerBoxContainer'

class StartPage extends Component {
  state = {
    error: null,
    banners: []
  }

  static propTypes = {
    page: string
  }

  componentDidMount() {
    const { page } = this.props
    switch (page) {
      case 'ludvika':
      case 'falun':
        this.setState({ left: '10px' })
        this.getPageContent(page)
        break
      default:
        this.getBanners()
        this.getPageContent('borlange')
        break
    }
  }

  getPageContent = (page) => {
    cms.getPageContent(page)
      .then(pageContent => {
        this.setState({ pageContent })
      })
      .catch(error => {
        console.error(error)
      })
  }

  getBanners = () => {
    // Get content from cms.js
    const options = {
      fields: ['title', 'shortInfo', ...defaultFields, 'link'],
      populate: [
        {
          field: 'images'
        }
      ]
    }
    cms.getContentGroup(ContentGroup.START_PAGE_BANNERS, options)
      .then(banners => {
        this.setState({ banners })
      })
      .catch(error => {
        if (error.constructor.name === 'CustomError') {
          // error är vårat CustomError
          this.setState({ error })
        } else {
          console.error(error.message)
        }
      })
  }

  handleClick = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    this.setState({
      left: `${rect.left + (rect.width * 0.5)}px`
    })
  }

  render() {
    const { banners, pageContent } = this.state
    return (
      <div style={{ position: 'relative' }}>
        {pageContent && <Route path='/:page?/:subpage?/:slug?' render={props => <MainPage {...props} content={pageContent} />} />}
        <BannerBoxContainer banners={banners} />
      </div>
    )
  }
}

export default StartPage
