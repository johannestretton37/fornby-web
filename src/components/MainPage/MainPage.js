import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GalleryPage from '../GalleryPage'
import Loading from '../Loading'
import ErrorPage from '../ErrorPage'
import { Row, Col } from 'reactstrap'
import SubMenu from '../SubMenu'
import cms from '../../cms'
import './MainPage.css'

class MainPage extends Component {
  state = {
    isLoading: true,
    pages: {}
  }

  static propTypes = {
    match: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.loadPages()
  }

  loadPages = async () => {
    let mainMenuItems = await cms.mainMenuItems()
    let pages = {}
    mainMenuItems.forEach(item => {
      const contentGroupName = item.url.replace('/', '')
      pages[contentGroupName] = (
        <GalleryPage contentType={contentGroupName} title={item.title} />
      )
    })
    this.setState({
      pages,
      isLoading: false
    })
  }
  
  render() {
    let { isLoading, pages } = this.state
    const page = this.props.match.params.page
    return (
      <Row>
        <Col md="2">
          <SubMenu />
        </Col>
        <Col>
          {isLoading ? <Loading /> : pages[page] || <ErrorPage />}
        </Col>
      </Row>
    )
  }
}

export default MainPage
