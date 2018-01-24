import React, { Component } from 'react'
import './Loading.css'
  
class Loading extends Component {
  render() {
    return (
      <div className='loading'>
        <figure className='spinner'></figure>
      </div>
    )
  }
}

export default Loading
