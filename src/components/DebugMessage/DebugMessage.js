import React, { Component } from 'react'
import './DebugMessage.css'
  
class DebugMessage extends Component {
  state = {
    isVisible: false
  }

  toggleIsVisible = () => {
    this.setState(prevState => ({isVisible: !prevState.isVisible}))
  }

  render() {
    const {isVisible} = this.state
    return (
      <div className={`debug-message${isVisible ? ' open' : ' closed'}`}>
        <div onClick={this.toggleIsVisible} className='close-button'>{isVisible ? 'CLOSE' : 'DEV INFO'}</div>
        {isVisible && 
        <div>
          <h5>STAGING SITE</h5>
          <p>This is only a preview site, built for editing purposes.</p>
          <hr/>
          <h6>To update content</h6>
          <p>Make your changes in <a href="https://app.flamelink.io/dashboard" target="_blank" rel="noopener noreferrer">flamelink</a> with the <i>isEditing</i> switch turned on. Then come back here to see the results.</p>
          <p>You might have to <a href='/'>reload</a> the page to see your changes.</p>
          <p>When things look the way you want, go back into flamelink, switch off <i>isEditing</i> and switch on <i>isPublished</i>.</p>
          <p>Your changes will now be published live.</p>
          <hr/>
          <p style={{textAlign: 'center'}}>For a detailed explanation, <a href='https://indd.adobe.com/view/632f8bd2-e6c4-4a0d-a6f1-9faac9677565' target="_blank" rel="noopener noreferrer">click here</a></p>
          <hr/>
          <p style={{textAlign: 'center'}}><a href="https://fornby-web.firebaseapp.com" target="_blank" rel="noopener noreferrer">Click here</a> for the official site</p>
        </div>}
      </div>
    )
  }
}

export default DebugMessage
