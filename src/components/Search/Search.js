import React, { Component } from 'react'
import {bool, func} from 'prop-types'
import SearchBar from '../SearchBar'
import cms from '../../cms'
import './Search.css'
  
class Search extends Component {
  state = {
    results: []
  }

  static propTypes = {
    isSearchBarOpen: bool.isRequired,
    toggleSearchBar: func,
    expandHorizontal: bool
  }

  static defaultProps = {
    expandHorizontal: false,
    toggleSearchBar: () => {}
  }

  performSearch = (searchText) => {
    const results = cms.search(searchText)
    this.setState({
      results
    })
  }

  render() {
    const {results} = this.state
    const {isSearchBarOpen, expandHorizontal} = this.props
    return (
      <SearchBar
        isOpen={isSearchBarOpen}
        expandHorizontal={expandHorizontal}
        toggleSearchBar={this.props.toggleSearchBar}
        performSearch={this.performSearch}
        results={results} />
    )
  }
}

export default Search
