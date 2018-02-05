import React from 'react'
import { object, string } from 'prop-types'
import DetailPage from '../DetailPage'
import Gallery from '../Gallery'
import './SubPage.css'

const SubPage = ({ content = {}, url }) => {
  let { name, detailPages, staff } = content
  return (
    <div>
      <h3>{name}</h3>
      {detailPages &&
        detailPages.map(detailPageContent => {
          let detailPage = detailPageContent.detailPage[0]
          return <DetailPage key={detailPage.id} content={detailPage} url={url} />
        })}
      {staff && <Gallery items={staff} />}
    </div>
  )
}

SubPage.propTypes = {
  content: object,
  url: string
}

export default SubPage
