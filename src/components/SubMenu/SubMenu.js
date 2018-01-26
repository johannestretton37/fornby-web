import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Nav, NavItem, Col } from 'reactstrap'
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
      const menuItems = pageMenuItems.subItems || []
      this.setState({ menuItems })
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
      menuItems && menuItems.length > 0 ?
      <Col md="3">
        <Nav className='sub-menu' vertical>
          {menuItems.map(this.menuItem)}
        </Nav>
      </Col>
      :
      null
    )
  }
}

export default withRouter(SubMenu)
