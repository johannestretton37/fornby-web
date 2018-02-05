import React from 'react'
import Linkable from '../Linkable'
import './DetailPage.css'

const DetailPage = ({ content = {}, url }) => {
  let { slug, name, shortInfo, body } = content
  return (
    <div>
      <Linkable id={slug} title={name} url={`${url}#${slug}`} />
      {shortInfo && (
        <p>
          <b>{shortInfo}</b>
        </p>
      )}
      {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
    </div>
  )
}

export default DetailPage
