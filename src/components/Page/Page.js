import React, { Component } from 'react'
import cms from '../../cms'
import './Page.css'
  
/**
 * A generic component that will display detailed information about
 * something, e.g. a course
 */
class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: {}
    }
  }

  componentDidMount() {
    this.getContent(this.props.match.params.page, this.props.match.params.slug)
  }

  getContent = async (group, id) => {
    try {
      let content = await cms.getContent(group, id)
      this.setState({ content })
    } catch (error) {
      const parentPath = this.props.location.pathname.replace(`/${id}`, '')
      console.error(error)
      this.props.history.push(parentPath)
    }
  }

  render() {
    const { content: { name, shortInfo } } = this.state
    return (
      <div>
        <h3>{name}</h3>
        <p><i>{shortInfo}</i></p>
        <p>Mer info kommer...</p>
      </div>
    )
  }
}

export default Page
