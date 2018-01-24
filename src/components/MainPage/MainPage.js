import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GalleryPage from '../GalleryPage'
import Loading from '../Loading'
import ErrorPage from '../ErrorPage'
import cms from '../../cms'
import './MainPage.css'

class MainPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      pages: {}
    }
  }

  componentDidMount() {
    this.loadPages()
  }

  loadPages = async () => {
    let mainMenuItems = await cms.mainMenuItems()
    let pages = {}
    mainMenuItems.forEach(item => {
      const contentGroupName = item.url.replace('/', '')
      pages[contentGroupName] = <GalleryPage contentType={contentGroupName} title={item.title} />
    })
    this.setState({
      pages,
      isLoading : false
    })
  }
  render() {
    let {isLoading, pages} = this.state
    const page = this.props.match.params.page
    return (
      isLoading ?
        <Loading />
      : 
        pages[page] || <ErrorPage />
    )
  }
}

MainPage.propTypes = {
  match: PropTypes.object.isRequired
}

export default MainPage
