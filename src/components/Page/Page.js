import React, { Component } from 'react'
import Fire from '../../Fire'
import logo from '../../assets/logo.png'
import './Page.css'
  
class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: [],
      newPageTitle: ''
    }
  }

  componentWillMount() {
    /* Create reference to pages in Firebase Database */
    let pagesRef = Fire.database()
      .ref('pages')
      .orderByKey()
      .limitToLast(100)
    pagesRef.on('value', snapshot => {
      /* Update React state */
      let pages = []
      snapshot.forEach(childSnapshot => {
        let page = childSnapshot.val()
        pages.push({
          key: childSnapshot.key,
          title: page.title
        })
      })
      this.setState({ pages })
    })
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Fornby Folkhögskola</h1>
        </header>
        <p className="App-intro">En levande mötesplats</p>
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

export default Page
