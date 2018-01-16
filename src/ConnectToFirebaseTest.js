import React, { Component } from 'react'

class Test extends Component {
  componentWillMount() {
    /* Create reference to pages in Firebase Database */
    let pagesRef = Fire.database()
      .ref('pages')
      .orderByKey()
      .limitToLast(100)
    pagesRef.on('value', snapshot => {
      /* Update React state */
      let pages = this.updatePages(snapshot)
      this.setState({ pages })
    })
  }

  updatePages = snapshot => {
    let pages = []
    snapshot.forEach(childSnapshot => {
      let page = childSnapshot.val()
      pages.push({
        key: childSnapshot.key,
        title: page.title
      })
    })
    return pages
  }

  handleInput = e => {
    let title = e.target.value
    this.setState({
      newPageTitle: title
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    let title = this.state.newPageTitle
    let newPage = {
      title: title,
      id: new Date().getTime()
    }
    /* Send the message to Firebase */
    Fire.database()
      .ref('pages')
      .push(newPage)
    this.setState({
      newPageTitle: ''
    })
  }

  render() {
    return (
      <div>
        <p>To login on admin page, click here: <a href="/admin">Admin pages login</a></p>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="addPage">Lägg till en ny kurs</label>
          <input
            id="addPage"
            type="text"
            placeholder="Kursnamn"
            onInput={this.handleInput}
            value={this.state.newPageTitle}
            style={{
              display: 'block',
              margin: '0.5em auto',
              padding: '1em',
              textAlign: 'center',
              borderRadius: '0.3em',
              border: '1px solid #ccc',
              fontSize: '1em',
              appearance: 'none'
            }}
          />
        </form>
        <ul>
          {this.state.pages.map(page => {
            return <li key={page.key} style={{ textAlign: 'left' }}>{page.title}</li>
          })}
        </ul>
      </div>
    )
  }
}