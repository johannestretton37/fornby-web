import React, { Component } from 'react'
import { bool, func, array } from 'prop-types'
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
  static propTypes = {
    results: array.isRequired,
    isOpen: bool,
    expandHorizontal: bool,
    toggleSearchBar: func,
    performSearch: func,
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

  performSearch = () => {
    let searchText = this.search.value
    this.props.performSearch(searchText)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.performSearch()
  }

  render() {
    const { expandHorizontal, isOpen, results } = this.props
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
              innerRef={search => this.search = search}
              onChange={this.handleChange}
              placeholder="Sök"
            />
            <ListGroup className='searchResults'>
              {results.map((result, i) => {
                const {heading, paragraph} = result
                return (
                  <ListGroupItem key={i} active={false}>
                    <a href={'/to/do/'}>
                      <ListGroupItemHeading><span dangerouslySetInnerHTML={{ __html: heading}} /></ListGroupItemHeading>
                      <ListGroupItemText><span dangerouslySetInnerHTML={{ __html: paragraph}} /></ListGroupItemText>
                    </a>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Form>
        </div>
      )
  }
}

export default SearchBar
