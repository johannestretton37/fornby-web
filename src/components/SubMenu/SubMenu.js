import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Nav, NavItem } from 'reactstrap'
import { array } from 'prop-types'
import Icon from '../Icon'
import './SubMenu.css'


class SubMenu extends Component {
  static propTypes = {
    items: array
  }

  static defaultProps = {
    items: []
  }

  getParentUrl(url) {
    const parts = url.split('/');
    const indexOfParentRoute = 2;
    return parts[indexOfParentRoute];
  }

  menuItem = (item, i) => {
    const location = this.props.history.location.pathname;

    return (
      <NavItem key={i}>
        <Link to={item.url} className={item.cssClass}>
          {item.title}
        </Link>
        {this.getParentUrl(item.url).indexOf(this.getParentUrl(location)) !== -1 && item.subItems &&
          <Nav vertical>
            {item.subItems.map(this.menuItem)}
          </Nav>
        }

      </NavItem>
    )
  }

  render() {
    const { items } = this.props
    return (
      items.length > 0 ?
        <Nav className='sub-menu' vertical>
          {items.map(this.menuItem)}
        </Nav>
        :
        null
    )
  }
}

export default withRouter(SubMenu)
