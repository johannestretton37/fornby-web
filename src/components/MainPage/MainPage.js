import React, { Component } from 'react'
import GalleryPage from '../GalleryPage'
import ContactPage from '../ContactPage'
import ErrorPage from '../ErrorPage'
import './MainPage.css'

const MainPage = ({ match }) => {
  // TODO: - Load from cms
  const pages = {
    kurser: <GalleryPage contentType="kurser" title="Kurser" />,
    kontakt: <ContactPage />
  }
  const page = match.params.page
  return pages[page] || <ErrorPage />
}

export default MainPage
