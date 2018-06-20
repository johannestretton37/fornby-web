import React from 'react'
import { object, string } from 'prop-types'
import DetailPage from '../DetailPage'
import Gallery from '../Gallery'
import './SubPage.css'

const SubPage = ({ content = {}, url }) => {
  let { name, body, shortInfo, staff, header } = content
  return (
    <div>
      {header ? <h2>{header}</h2> : <h2>{name}</h2>}

      {<p className="short-info">{shortInfo}</p>}
      {body && <p className='main-body' dangerouslySetInnerHTML={{ __html: body }} />}
      {/*detailPages &&
        detailPages.map(detailPageContent => {
          let detailPage = detailPageContent.detailPage[0]
          return <DetailPage key={detailPage.id} content={detailPage} url={url} />
        })*/}
      {staff && <Gallery items={staff} />}
    </div>
  )
}

SubPage.propTypes = {
  content: object,
  url: string
}

export default SubPage
