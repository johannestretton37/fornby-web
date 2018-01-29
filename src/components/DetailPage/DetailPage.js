import React from 'react'
import Linkable from '../Linkable'
import './DetailPage.css'

const DetailPage = ({ content = [], url }) => {
  return content.map(({ slug, name, shortInfo, body }, i) => {
    return (
      <div key={i}>
        <Linkable id={slug} tag='h4' title={name} url={`${url}#${slug}`} />
        {shortInfo && <p><b>{shortInfo}</b></p>}
        {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
    )
  })
}

export default DetailPage
