import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Content.css'
import cms from '../../cms'

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: []
    }
  }

  componentDidMount() {
    this.getCourses()
  }

  getCourses = async () => {
    // This will get all courses and update them as soon as anything changes
    cms.subscribeToCourses(courses => {
      this.setState({ courses })
    })
    // This will get all courses on app load, updated on page reload
    // const courses = await cms.courses()
    // this.setState({
    //   courses
    // })
  }

  render() {
    return (
      <main>
        <h2>Kurser</h2>
        <ul>
          {this.state.courses.map((course, i) => {
            return (
              <li key={i}>
                <Link to={`/kurser/${course.slug}`}>{course.name}</Link>
                <p>{course.shortInfo}</p>
              </li>
            )
          })}
        </ul>
      </main>
    )
  }
}

export default Content
