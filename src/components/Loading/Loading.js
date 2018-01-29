import React, { Component } from 'react'
import './Loading.css'

class Loading extends Component {
  render() {
    return (
      <div className="loading-container">
        <div className="loading">
          <figure className="spinner" />
        </div>
      </div>
    )
  }
}

export default Loading
