import React, { Component } from 'react'
import './CoursePage.css'
import PropTypes from 'prop-types'
import DateHelper from '../../Helpers'
import ImagePreLoader from '../ImagePreLoader'
import Image from '../Image'
import happy_student from '../../assets/happy_student.jpg'
import { formatDate } from '../../Helpers'


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
    return <div className='course-box-columns-column' >
      {array.map((row) => this.renderRow(row.bold, row.text))}
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
    const firstColumn = [
      this.createBoxContent('Kursstart', DateHelper.formatDate(courseStartDate)),
      this.createBoxContent('Ansök senast', DateHelper.formatDate(applicationDeadline))
    ];
    const secondColumn = [
      this.createBoxContent('Kurstyp', courseType),
      this.createBoxContent('Studietakt', courseTempo + '%'),
      this.createBoxContent('Antagningsvillkor', courseAdmissionConditions),
    ];
    const thirdColumn = [
      this.createBoxContent('Längd', courseLength),
      this.createBoxContent('Lediga platser', isFullText),
      this.createBoxContent('Internat', city),
    ];
    const fourthColumn = [
      this.createBoxContent('Kostnader', courseExpenses),
      this.createBoxContent('Studiestödsnivå(CSN)', courseStudyLevel),
    ];
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
      courseStartDate, applicationDeadline, summary, mainBody, mainImage, name
    } = this.props.content;
    return (
      <div className='course' >
        {name && <div className='course-image_wrapper'>
          <Image className='full-width' src={happy_student} height={400} />
          <p className='course-title'>{name}</p>
          <div className='course-attend_button'>
            <span>ANSÖK TILL {name}</span>
          </div>
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
