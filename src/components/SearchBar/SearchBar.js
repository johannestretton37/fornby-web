import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { bool, func, array, object } from 'prop-types'
import Toggler from '../Toggler'
import {
  Form,
  Input,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap'
import './SearchBar.css'

class SearchBar extends Component {
  state = {
    isSelected: -1
  }

  static propTypes = {
    results: array.isRequired,
    isOpen: bool,
    expandHorizontal: bool,
    toggleSearchBar: func,
    performSearch: func,
    history: object
  }

  static defaultProps = {
    results: [],
    toggleSearchBar: () => {console.warn('this.props.toggleSearchBar() is undefined')},
    performSearch: () => {console.warn('this.props.performSearch() is undefined')}
  }

  handleClick = e => {
    e.preventDefault()
    this.performSearch()
    if (this.props.isOpen) {
      // Close
      // Clear form
      this.search.value = ''
      this.search.blur()
    } else {
      // Open
      this.search.focus()
    }
    this.props.toggleSearchBar()
  }

  handleChange = e => {
    e.preventDefault()
    this.performSearch()
  }

  handleKeyDown = e => {
    switch (e.key) {
      case 'ArrowDown':
        this.setState(prevState => {
          let index = prevState.isSelected + 1
          if (index === this.props.results.length) index = this.props.results.length - 1
          return {
            isSelected: index
          }
        })
      break
      case 'ArrowUp':
      this.setState(prevState => {
        let index = prevState.isSelected - 1
        if (index < 0) index = -1
        return {
          isSelected: index
        }
      })
      break
      default: break
    }
  }

  performSearch = () => {
    let searchText = this.search.value
    this.setState({ isSelected: -1 })
    this.props.performSearch(searchText)
  }

  clearResults = () => {
    this.search.value = ''
    this.performSearch()
  }

  handleSubmit = e => {
    e.preventDefault()
    const {isSelected} = this.state
    const {history, results} = this.props
    if (isSelected > -1) {
      let selectedResult = results[isSelected]
      this.clearResults()
      history.push(selectedResult.url)
    }
    this.performSearch()
  }

  render() {
    const { expandHorizontal, isOpen, results } = this.props
    const { isSelected } = this.state
    return (
        <div className={`searchbar-container${expandHorizontal ? ' horizontal' : ' vertical' }${isOpen ? ' open' : ' closed'}`}>
          {expandHorizontal && <Toggler
            id='searchbar-toggler-large-screens'
            className='searchbar-toggler'
            onClick={this.handleClick}
            iconOpen='search'
            iconClosed='search'
            align='right'
            />}
          <Form onSubmit={this.handleSubmit}>
            <Input
              type="search"
              name="search"
              autoComplete="off"
              innerRef={search => this.search = search}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Sök"
            />
            <ListGroup className='searchResults'>
              {results.map((result, i) => {
                const {heading, paragraph, url} = result
                return (
                  <ListGroupItem key={i} className={isSelected === i ? 'selected' : ''}>
                    <Link onClick={this.clearResults} to={url}>
                      <ListGroupItemHeading><span dangerouslySetInnerHTML={{ __html: heading}} /></ListGroupItemHeading>
                      <ListGroupItemText><span dangerouslySetInnerHTML={{ __html: paragraph}} /></ListGroupItemText>
                    </Link>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Form>
        </div>
      )
  }
}

export default withRouter(SearchBar)
