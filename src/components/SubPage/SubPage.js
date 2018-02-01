import React from 'react'
import { object, string } from 'prop-types'
import DetailPage from '../DetailPage'
import './SubPage.css'

const SubPage = ({ content = {}, url }) => {
  let { name, detailPages, slug } = content
  return (
    <div style={{ border: '3px double blue', padding: '3px' }}>
    <p style={{ color: 'blue' }}>SubPage</p>
      <h2>{name}</h2>
      {detailPages &&
        detailPages.map(detailPageContent => {
          let detailPage = detailPageContent.detailPage[0]
          return <DetailPage key={detailPage.id} content={detailPage} url={`${url}/${slug}`} />
        })}
    </div>
  )
}

SubPage.propTypes = {
  content: object,
  url: string
}

export default SubPage
