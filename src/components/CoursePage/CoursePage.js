import React, { Component } from 'react'
import './CoursePage.css'
import { bool, string, instanceOf, element, any, func, object } from 'prop-types'
import { withRouter } from 'react-router-dom'
import DateHelper from '../../Helpers'
import SmoothImage from '../SmoothImage'
import Gallery from '../Gallery'

class CoursePage extends Component {
  static propTypes = {
    content: any.isRequired,
    name: string,
    shortInfo: string,
    courseStartDate: instanceOf(Date),
    applicationDeadline: instanceOf(Date),
    summary: element,
    mainBody: element,
    mainImage: any,
    mainImageURL: any,
    onApplyClicked: func,
    courseIsFull: bool,
    history: object
  }

  handleClick = e => {
    e.preventDefault()
    this.props.history.push('/ansok')
  }

  renderColumn(array) {
    if (!array || array.length === 0) return;
    return <div className='course-box-columns-column' >
      {array.map((row) => row && this.renderRow(row.bold, row.text, row.className))}
    </div>
  }

  renderRow(bold, text, className) {
    return (
      <p className={'course-box ' + className} key={bold}>
        <strong>{bold}: </strong>
        {text}
      </p>
    );
  }

  createBoxContent(bold, text, className) {
    if (!text) return null;
    return { bold: bold, text: text, className: className }
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
      courseStartDate,
      staff,
      internat
    } = this.props.content;

    let isFullText = courseIsFull && courseIsFull ? 'Nej' : 'Ja';
    let contact = staff ? staff[0] : null;
    let contactName = contact ? contact.name : null;
    let contactPhone = contact ? contact.phone : null;
    let contactEmail = contact ? contact.email : null;
    let contactEmailRef = contactEmail ? 'mailto:' + contactEmail : null;
    let fixedCity = city === 'borlange' ? 'Borlänge' : city;
    const firstColumn = [];
    courseStartDate && firstColumn.push(this.createBoxContent('Kursstart', <span><br />{DateHelper.formatDate(courseStartDate)}</span>, 'info'));
    applicationDeadline && firstColumn.push(this.createBoxContent('Ansök senast', applicationDeadline, 'info'));
    courseType && firstColumn.push(this.createBoxContent('Kurstyp', courseType, 'info'));
    courseTempo && firstColumn.push(this.createBoxContent('Studietakt', (courseTempo + '%'), 'info'));
    internat && firstColumn.push(this.createBoxContent('Internat', internat ? 'Ja' : 'Nej', 'info'));
    courseAdmissionConditions && firstColumn.push(this.createBoxContent('Antagningsvillkor', courseAdmissionConditions, 'info'));
    courseLength && firstColumn.push(this.createBoxContent('Längd', courseLength, 'info'));
    isFullText && firstColumn.push(this.createBoxContent('Lediga platser', isFullText, 'info'));
    fixedCity && firstColumn.push(this.createBoxContent('Ort', fixedCity, 'info'));
    courseExpenses && firstColumn.push(this.createBoxContent('Kostnader', courseExpenses, 'info'));
    courseStudyLevel && firstColumn.push(this.createBoxContent('Studiestödsnivå(CSN)', courseStudyLevel, 'info'));
    contactName && firstColumn.push(this.createBoxContent('Kontakt',
      <span>
        <br />
        {contactName}
        <br />
        {contactPhone}
        <br />
        <a href={contactEmailRef}>{contactEmail}</a>
      </span>, 'contact'));
    //contactPhone && firstColumn.push(this.createBoxContent('Telefon', contactPhone));
    //contactEmail && firstColumn.push(this.createBoxContent('E-post', <a href={contactEmailRef}>{contactEmail}</a>));

    return (
      <div className='course-box-columns'>
        {this.renderColumn(firstColumn)}
      </div>
    );
  }

  render() {
    const {
      // courseStartDate, applicationDeadline, images, previews,
      summary, mainBody, name, images, previews, staff, slug
    } = this.props.content;

    let src = images ? images[0].url : null;
    const preview = previews ? previews[0] : null

    return (
      <div id={slug} className='course' >
        {name && <div className='course-image_wrapper'>
          <SmoothImage className='full-width' src={src} preview={preview} height={400}>

            <div className='course-attend_button' onClick={this.handleClick}>
              <span>ANSÖK NU</span>
            </div>
          </SmoothImage>
        </div>}
        {name && <h1>{name}</h1>}
        {summary && <div className='course-header'>
          <p className='course-summary' dangerouslySetInnerHTML={{ __html: summary }} />
        </div>}
        <figure className='course-box-container'>
          {this.renderBox()}
        </figure>

        {mainBody && <p className='course-main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />}
        {staff && staff.length > 0 && <Gallery items={staff} />}
      </div>
    )
  }
}
export default withRouter(CoursePage);
