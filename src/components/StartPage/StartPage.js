import React, { Component } from 'react'
import { string } from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import CustomError from '../../models/CustomError'
import { ContentGroup } from '../../constants'
import heroImg from '../../assets/heroImg.jpg'
import Image from '../Image'
import MainPage from '../MainPage'
import BannerBox from '../BannerBox'
import cms from '../../cms'
import './StartPage.css'

class StartPage extends Component {
  state = {
    error: null,
    banners: []
  }

  static propTypes = {
    page: string
  }

  componentDidMount() {
    const { page } = this.props
    switch (page) {
      case 'ludvika':
      case 'falun':
      this.setState({ left: '10px' })
        this.getPageContent(page)
      break
      default:
        this.getBanners()
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
      fields: ['title', 'shortInfo', 'isVisible', 'action', 'actionSubPage', 'actionDetailPage', 'image'],
      populate: [
        {
          field: 'action'
        },
        {
          field: 'actionSubPage'
        },
        {
          field: 'actionDetailPage'
        },
        {
          field: 'image'
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
      <div style={{ position: 'relative' }}>
        {pageContent && <Route path='/:page/:subpage?/:slug?' render={props => <MainPage {...props} content={pageContent} subMenu={false} />} />}
        {banners.length > 0 &&
        <div className='banner-boxes-container full-width'>
          <Container className='banner-boxes'>
            <Row>
              {banners.map((banner, i) => {
                return <BannerBox key={i} content={banner} />
              })}
            </Row>
          </Container>
        </div>}
      </div>
    )
  }
}

export default StartPage
