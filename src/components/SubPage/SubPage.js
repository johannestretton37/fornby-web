import React from 'react'
import { object, string } from 'prop-types'
import DetailPage from '../DetailPage'
import './SubPage.css'

const SubPage = ({ content = {}, url }) => {
  let { name, detailPages } = content
  return (
    <div>
      <h3>{name}</h3>
      {detailPages &&
        detailPages.map(detailPageContent => {
          let detailPage = detailPageContent.detailPage[0]
          return <DetailPage key={detailPage.id} content={detailPage} url={url} />
        })}
    </div>
  )
}

SubPage.propTypes = {
  content: object,
  url: string
}

export default SubPage
