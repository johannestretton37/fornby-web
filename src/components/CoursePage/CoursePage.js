import React from 'react'
import './CoursePage.css'
import PropTypes from 'prop-types'
import DateHelper from '../../Helpers'
import ImagePreLoader from '../ImagePreLoader'

CoursePage.propTypes = {
  content: PropTypes.any.isRequired,
  name: PropTypes.string,
  shortInfo: PropTypes.string,
  courseStartDate: PropTypes.instanceOf(Date),
  applicationDeadline: PropTypes.instanceOf(Date),
  summary: PropTypes.element,
  mainBody: PropTypes.element,
  mainImage: PropTypes.any,
  mainImageURL: PropTypes.any
}
function CoursePage({ content, mainImageURL }) {

  const {
    courseStartDate, applicationDeadline, summary, mainBody, mainImage
  } = content;

  return (
    <div>
      <h3 className='course-summary'>{summary}</h3>
      <h4 className='course-date' >Startdatum: {DateHelper.formatDate(courseStartDate)}</h4>
      <h4 className='course-date' >Sista ansökningsdag: {DateHelper.formatDate(applicationDeadline)}</h4>
      {(() => {
        if (mainImage) {
          return (<ImagePreLoader previewImg={''}>
            <img src={mainImageURL} alt={content.name} />
          </ImagePreLoader>)
        }
      })()}
      <div className='course-main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />
    </div>
  )
}
export default CoursePage;
