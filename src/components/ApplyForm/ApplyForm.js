import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import './ApplyForm.css'
  
class ApplyForm extends Component {
  render() {
    return (
      <Row>
        <Col>
          <div className='iframe-container'>
            <iframe id='schoolsoft' title='Ansökan SchoolSoft' src='https://sms.schoolsoft.se/fhsk/jsp/LoginApplicant.jsp#/'></iframe>
          </div>
        </Col>
      </Row>
    )
  }
}

export default ApplyForm
