import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import './ApplyForm.css'
  
class ApplyForm extends Component {
  state = {
    iframeSrc: '',
    isLoaded: false
  }

  componentDidMount() {
    this.setState({
      iframeSrc: 'https://sms.schoolsoft.se/fhsk/jsp/LoginApplicant.jsp#/'
    })
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
        </Col>
      </Row>
    )
  }
}

export default ApplyForm
