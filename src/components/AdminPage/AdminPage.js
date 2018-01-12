import React, { Component } from 'react'
import './AdminPage.css'
import AdminContext from '../AdminContext'

class AdminPage extends Component {
  render() {
    return (
      <AdminContext>
        <h3>Admin Page</h3>
        <p>
          <b>Logged in</b>
        </p>
        <p>
          This important text is protected by authentication. If you see this,
          you are logged in as an Editor and can add or delete courses.
        </p>
      </AdminContext>
    )
  }
}

export default AdminPage
