import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { object, string } from 'prop-types'
import { DateHelper } from '../../Helpers'
import ImagePreLoader from '../ImagePreLoader'
import './DefaultPage.css'

class DefaultPage extends Component {
  static propTypes = {
    content: object,
    mainImageURL: string
  }

  render() {
    const { content: { name, summary, shortInfo, mainBody, subContent }, mainImageURL } = this.props
    return (
      <div className="default-page">
        <h3 className="summary">{summary}</h3>
        {mainImageURL && (
          <ImagePreLoader previewImg={''}>
            <img src={mainImageURL} alt={name} />
          </ImagePreLoader>
        )}
        <p><i>{shortInfo}</i></p>
        <div
          className="main-body"
          dangerouslySetInnerHTML={{ __html: mainBody }}
        />
        {subContent && subContent.map((article, i) => {
          return (
            <div key={i}>
              <h4 id={article.slug}>{article.name}</h4>
              <p><b>{article.shortInfo}</b></p>
            </div>
          )
        })}
      </div>
    )
  }
}

export default DefaultPage
