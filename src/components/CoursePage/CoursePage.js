import React, { Component } from 'react'
import './CoursePage.css'
import PropTypes from 'prop-types'
import DateHelper from '../../Helpers'
import SmoothImage from '../SmoothImage'
import happy_student from '../../assets/happy_student.jpg'
// import { formatDate } from '../../Helpers'


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
      {array.map((row) => row && this.renderRow(row.bold, row.text))}
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

    const secondColumn = [];
    courseType && secondColumn.push(this.createBoxContent('Kurstyp', courseType));
    courseTempo && secondColumn.push(this.createBoxContent('Studietakt', courseTempo));
    courseAdmissionConditions && secondColumn.push(this.createBoxContent('Antagningsvillkor', courseAdmissionConditions));

    const thirdColumn = [];
    courseLength && thirdColumn.push(this.createBoxContent('Längd', courseLength));
    isFullText && thirdColumn.push(this.createBoxContent('Lediga platser', isFullText));
    city && thirdColumn.push(this.createBoxContent('Internat', city));

    const fourthColumn = [];
    courseExpenses && fourthColumn.push(this.createBoxContent('Kostnader', courseExpenses));
    courseStudyLevel && fourthColumn.push(this.createBoxContent('Studiestödsnivå(CSN)', courseStudyLevel));

    return (
      <div className='course-box-columns'>
        {this.renderColumn(firstColumn)}
        {this.renderColumn(secondColumn)}
        {this.renderColumn(thirdColumn)}
        {this.renderColumn(fourthColumn)}
      </div>
    );
  }


  render() {
    const {
      // courseStartDate, applicationDeadline, images, previews,
      summary, mainBody, name
    } = this.props.content;
    return (
      <div className='course' >
        {name && <div className='course-image_wrapper'>
          <SmoothImage className='full-width' src={happy_student} height={400}>
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
