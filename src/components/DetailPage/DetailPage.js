import React from 'react'
import Linkable from '../Linkable'
import './DetailPage.css'

const DetailPage = ({ content = {}, url }) => {
  console.log('DetailPage:', content)
  let { slug, name, shortInfo, body } = content
  return (
    <div style={{ border: '3px double red', padding: '3px' }}>
      <p style={{ color: 'red' }}>DetailPage</p>
      <Linkable id={slug} tag="h4" title={name} url={`${url}#${slug}`} />
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
