import React, { Component } from 'react'
import './CoursePage.css'
import PropTypes from 'prop-types'
import DateHelper from '../../Helpers'
import SmoothImage from '../SmoothImage'


class CoursePage extends Component {
  static propTypes = {
    content: PropTypes.any.isRequired,
    name: PropTypes.string,
    shortInfo: PropTypes.string,
    courseStartDate: PropTypes.instanceOf(Date),
    applicationDeadline: PropTypes.instanceOf(Date),
    summary: PropTypes.element,
    mainBody: PropTypes.element,
    mainImage: PropTypes.any,
    mainImageURL: PropTypes.any,
    onApplyClicked: PropTypes.func,
    courseIsFull: PropTypes.bool
  }
  renderColumn(array) {
    if (!array || array.length === 0) return;
    return <div className='course-box-columns-column' >
      {array.map((row) => row && this.renderRow(row.bold, `\n${row.text}`))}
    </div>
  }
  
  renderRow(bold, text) {
    return (
      <p>
        <strong>{bold}: </strong>
        {text}
      </p>
    );
  }
  createBoxContent(bold, text) {
    if (!text) return null;
    return { bold: bold, text: text }
  }

  renderBox() {
    const {
      courseType,
      courseTempo,
      courseLength,
      applicationDeadline,
      courseIsFull,
      courseExpenses,
      courseStudyLevel,
      city,
      courseAdmissionConditions,
      courseStartDate
    } = this.props.content;

    let isFullText = courseIsFull && courseIsFull ? 'Nej' : 'Ja';

    const firstColumn = [];
    courseStartDate && firstColumn.push(this.createBoxContent('Kursstart', DateHelper.formatDate(courseStartDate)));
    applicationDeadline && firstColumn.push(this.createBoxContent('Ansök senast', DateHelper.formatDate(applicationDeadline)));
    courseType && firstColumn.push(this.createBoxContent('Kurstyp', courseType));
    courseTempo && firstColumn.push(this.createBoxContent('Studietakt', courseTempo));
    courseAdmissionConditions && firstColumn.push(this.createBoxContent('Antagningsvillkor', courseAdmissionConditions));
    courseLength && firstColumn.push(this.createBoxContent('Längd', courseLength));
    isFullText && firstColumn.push(this.createBoxContent('Lediga platser', isFullText));
    city && firstColumn.push(this.createBoxContent('Internat', city));
    courseExpenses && firstColumn.push(this.createBoxContent('Kostnader', courseExpenses));
    courseStudyLevel && firstColumn.push(this.createBoxContent('Studiestödsnivå(CSN)', courseStudyLevel));

    return (
      <div className='course-box-columns'>
        {this.renderColumn(firstColumn)}
      </div>
    );
  }

  render() {
    const {
      summary, mainBody, name, images, previews
    } = this.props.content;
    let src = images ? images[0].url : null;
    const preview = previews ? previews[0] : null

    return (
      <div className='course' >
        {name && <div className='course-image_wrapper'>
          <SmoothImage className='full-width' src={src} preview={preview} height={400}>
            <p className='course-title'>{name}</p>
            <div className='course-attend_button'>
              <span>ANSÖK TILL {name}</span>
            </div>
          </SmoothImage>
        </div>}
        {summary && <div className='course-header'>
          <p className='course-summary' dangerouslySetInnerHTML={{ __html: summary }} />
        </div>}
        <figure className='course-box-container'>
          {this.renderBox()}
        </figure>

        {summary && <p className='course-main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />}

      </div>
    )
  }
}
export default CoursePage;
