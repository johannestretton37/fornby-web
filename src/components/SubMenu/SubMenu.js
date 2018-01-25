import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { object } from 'prop-types'
import cms from '../../cms'
import './SubMenu.css'

class SubMenu extends Component {
  state = {
    menuItems: []
  }

  static propTypes = {
    match: object.isRequired
  }

  componentDidMount() {
    this.getSubMenu(this.props.match.params.page)
  }

  getSubMenu = (page) => {
    return new Promise(async resolve => {
      const mainMenuItems = await cms.mainMenuItems()
      const pageMenuItems = mainMenuItems.find(mainItem => mainItem.url === '/' + page)
      this.setState({ menuItems: pageMenuItems.subItems })
      resolve()
    })
  }

  menuItem = (item, i) => {
    return (
      <NavItem key={i}>
        <Link to={item.url} className={item.cssClass}>{item.title}</Link>
        {item.subItems &&
          <Nav vertical>
            {item.subItems.map(this.menuItem)}
          </Nav>
        }
      </NavItem>
    )
  }

  render() {
    const { menuItems } = this.state
    return (
      <Nav vertical>
        {menuItems.map(this.menuItem)}
      </Nav>
    )
  }
}

export default withRouter(SubMenu)
