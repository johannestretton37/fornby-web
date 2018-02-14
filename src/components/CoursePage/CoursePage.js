import React from 'react'
import './CoursePage.css'
import PropTypes from 'prop-types'
import DateHelper from '../../Helpers'
import ImagePreLoader from '../ImagePreLoader'
import Image from '../Image'
import happy_student from '../../assets/happy_student.jpg'

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
    <div className='course' >
      {name && <div className='course-image_wrapper'>
        <Image className='full-width' src={happy_student} height={400} />
        <p className='course-title'>{name}</p>
        <div className='course-attend_button'>
          <span>ANSÖK TILL {name}</span>
        </div>
      </div>}
      <div className='course-header'>
        <p className='course-summary' dangerouslySetInnerHTML={{ __html: summary }} />
        {courseStartDate && <h5 className='course-date' >Startdatum: {DateHelper.formatDate(courseStartDate)}</h5>}
        {applicationDeadline && <h5 className='course-date' >Sista ansökningsdag: {DateHelper.formatDate(applicationDeadline)}</h5>}
      </div>
      <p className='course-main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />

    </div>
  )
}

export default CoursePage;
