import React from 'react'
import './CoursePage.css'
import PropTypes from 'prop-types'
import DateHelper from '../../Helpers'
import ImagePreLoader from '../ImagePreLoader'
import { Button } from 'reactstrap'

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
    courseStartDate, applicationDeadline, summary, mainBody, mainImage, name, colorScheme
  } = content;
  console.log(colorScheme)
  return (
    <div>
      <div className='course-header'>
        <div className='course-summary' dangerouslySetInnerHTML={{ __html: summary }} />
        <h4 className='course-date' >Startdatum: {DateHelper.formatDate(courseStartDate)}</h4>
        <h4 className='course-date' >Sista ansökningsdag: {DateHelper.formatDate(applicationDeadline)}</h4>
        <Button style={{ 'background-color': colorScheme, 'border-color': colorScheme }} color="primary" size="lg" onClick={onApplyClicked}>{'Ansök till ' + name}</Button>
      </div>
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
