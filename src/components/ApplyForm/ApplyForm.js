import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import './ApplyForm.css'
  
class ApplyForm extends Component {
  state = {
    iframeSrc: 'https://sms.schoolsoft.se/fhsk/jsp/LoginApplicant.jsp#/',
    isLoaded: false
  }

  handleLoad = () => {
    this.setState({
      isLoaded: true
    })
  }

  render() {
    const { iframeSrc, isLoaded } = this.state
    return (
      <Row>
        <Col>
          <div className='iframe-container'>
            <iframe id='schoolsoft' style={{ opacity: isLoaded ? 1 : 0 }} onLoad={this.handleLoad} title='Ansökan SchoolSoft' src={iframeSrc}></iframe>
          </div>
          <p style={{textAlign: 'center', marginBottom: '2em'}}>Du kan också <a style={{fontWeight: 'bold'}}href={iframeSrc} target='_blank'>klicka här</a> för att öppna ansökningen i ett nytt fönster.</p>
        </Col>
      </Row>
    )
  }
}

export default ApplyForm
