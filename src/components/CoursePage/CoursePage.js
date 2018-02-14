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
        <p className='course-summary' dangerouslySetInnerHTML={{ __html: summary }} />
        {courseStartDate && <h5 className='course-date' >Startdatum: {DateHelper.formatDate(courseStartDate)}</h5>}
        {applicationDeadline && <h5 className='course-date' >Sista ansökningsdag: {DateHelper.formatDate(applicationDeadline)}</h5>}
        <p>
          <button className='btn default' color="primary" size="lg" onClick={onApplyClicked}>{'Ansök till ' + name}</button>
        </p>
      </div>
      <p className='course-main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />
    </div>
  )
}

export default CoursePage;
