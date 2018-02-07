import React, { Component } from 'react'
import { bool } from 'prop-types'
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
    results: []
  }

  static propTypes = {
    isOpen: bool
  }

  handleChange = e => {
    e.preventDefault()
    this.setState({
      results: [
        {
          heading: '[MOCK SEARCH RESULT] Musikkurser',
          body:
            'Här hittar du alla våra musikkurser. Men du, detta är bara ett exempel, sökfunktionen är inte implementerad ännu.'
        }
      ]
    })
  }

  render() {
    const { results } = this.state
    const { isOpen } = this.props
    const debug = true
    return (
      debug && (
        <div className={`searchbar-container${isOpen ? ' open' : ' closed'}`}>
          <Form>
            <Input
              type="search"
              name="search"
              onChange={this.handleChange}
              id="exampleSearch"
              placeholder="search will be implemented soon..."
            />
            <ListGroup>
              {results.map((result, i) => (
                <ListGroupItem key={i} active={false}>
                  <ListGroupItemHeading>{result.heading}</ListGroupItemHeading>
                  <ListGroupItemText>{result.body}</ListGroupItemText>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Form>
        </div>
      )
    )
  }
}

export default SearchBar
