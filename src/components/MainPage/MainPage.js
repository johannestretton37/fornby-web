import React from 'react'
import GalleryPage from '../GalleryPage'
import ContactPage from '../ContactPage'
import { ContentGroup } from '../../constants'
import ErrorPage from '../ErrorPage'
import './MainPage.css'

const MainPage = ({ match }) => {
  // TODO: - Load from cms
  const pages = {
    [ContentGroup.COURSES]: <GalleryPage contentType={ContentGroup.COURSES} title="Kurser" />,
    kontakt: <ContactPage />,
  }
  const page = match.params.page
  return pages[page] || <ErrorPage />
}

export default MainPage
