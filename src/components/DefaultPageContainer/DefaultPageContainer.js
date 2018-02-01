import React, { Component } from 'react'
import { object } from 'prop-types'
import cms from '../../cms'
import './DefaultPageContainer.css'
  
class DefaultPageContainer extends Component {
  state = {
    content: []
  }

  static propTypes = {
    match: object
  }
  componentDidMount() {
    this.getContent()
  }

  getContent = async () => {
    const page = this.props.match.params.page
    const content = await cms.getContentGroup(page)
    debugger
    this.setState({
      content
    })

  }
  
  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default DefaultPageContainer
