import React, { Component } from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import CustomError from '../../models/CustomError'
import { ContentGroup } from '../../constants'
import heroImg from '../../assets/heroImg.jpg'
import Image from '../Image'
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

  render() {
    const { banners } = this.state
    const cities = [
      {
        title: 'FALUN',
        url: '/falun'
      },
      {
        title: 'BORLÄNGE',
        url: '/'
      },
      {
        title: 'LUDVIKA',
        url: '/ludvika'
      },
    ]
    return (
      <div>
        <Image className='full-width' src={heroImg} height={400} />
        {/* <StartPageCarousel /> */}
        <div className='city-links full-width'>
          <Container>
            <Row>             
            {cities.map((city, i) => {
              return (
                <Col xs='12' md='4' key={i}>
                  <Link className={`city${i === cities.length - 1 ? ' last' : ''}`} to={city.url}>{city.title}</Link>
                </Col>
              )
            })}
            </Row>
          </Container>
          </div>
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
