import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { object, string } from 'prop-types'
import { DateHelper } from '../../Helpers'
import ImagePreLoader from '../ImagePreLoader'
import DetailPage from '../DetailPage'
import './DefaultPage.css'

class DefaultPage extends Component {
  static propTypes = {
    content: object,
    mainImageURL: string,
    location: object
  }

  render() {
    const { content: { name, summary, shortInfo, mainBody, subContent }, mainImageURL, location } = this.props
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
        <DetailPage content={subContent} url={location.pathname} />
      </div>
    )
  }
}

export default withRouter(DefaultPage)
