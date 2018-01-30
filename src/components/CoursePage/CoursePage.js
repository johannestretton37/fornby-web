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
  mainImageURL: PropTypes.any,
  onApplyClicked: PropTypes.func
}
function CoursePage({ content, mainImageURL, onApplyClicked }) {

  const {
    courseStartDate, applicationDeadline, summary, mainBody, mainImage, name
  } = content;
  return (
    <div>
      <div className='course-header'>
        <p>
          <div className='course-summary' dangerouslySetInnerHTML={{ __html: summary }} /></p>
        <p>
          <h5 className='course-date' >Startdatum: {DateHelper.formatDate(courseStartDate)}</h5>
          <h5 className='course-date' >Sista ansökningsdag: {DateHelper.formatDate(applicationDeadline)}</h5>
        </p>
        <p>
          <button className='btn default' color="primary" size="lg" onClick={onApplyClicked}>{'Ansök till ' + name}</button>
        </p>

      </div>
      {(() => {
        if (mainImage) {
          return (<ImagePreLoader previewImg={''}>
            <img src={mainImageURL} alt={content.name} />
          </ImagePreLoader>)
        }
      })()}
      <p>
        <div className='course-main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />
      </p>
    </div>
  )
}
export default CoursePage;
