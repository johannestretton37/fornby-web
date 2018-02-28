import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Nav, NavItem, Col } from 'reactstrap'
import { object } from 'prop-types'
import cms from '../../cms'
import './SubMenu.css'
import { PageSlug, ContentGroup } from '../../constants'

class SubMenu extends Component {
  state = {
    menuItems: []
  }

  static propTypes = {
    match: object.isRequired
  }

  componentDidMount() {
    console.log(`Submenu for ${this.props.match.params.page}`)
    console.log(this.props.match)
    this.getSubMenu(this.props.match.params.page)

  }

  getCoursesMenuItems(pageContent) {
    let menuItems = []
    if (pageContent === undefined || !pageContent.courseCategories) return this.menuItems;
    const page = '/' + this.props.match.params.page
    pageContent.courseCategories.forEach(subpage => {
      let menuItem = {
        title: subpage.name,
        url: page + '/' + subpage.slug
      }
      if (subpage.courses) {
        subpage.courses.forEach(course => {
          let { name, slug } = course
          if (!menuItem.subItems) menuItem.subItems = []
          menuItem.subItems.push({
            title: name,
            url: page + '/' + subpage.slug + '/' + slug
          })
        })
      }
      menuItems.push(menuItem)
    })
    return menuItems;
  }

  getSubPagesMenuItems(pageContent) {
    let menuItems = []
    const page = '/' + this.props.match.params.page
    pageContent.subPages.forEach(subPage => {
      let menuItem = {
        title: subPage.name,
        url: page + '/' + subPage.slug
      }
      if (subPage.detailPages) {
        subPage.detailPages.forEach(detailPage => {
          let { name, slug } = detailPage.detailPage[0]
          if (!menuItem.subItems) menuItem.subItems = []
          menuItem.subItems.push({
            title: name,
            url: page + '/' + subPage.slug + '#' + slug
          })
        })
      }
      menuItems.push(menuItem)
    })
    return menuItems;
  }
  
  getSubMenu = (page) => {
    if (!page) return
    return new Promise(async resolve => {
      const pageContent = await cms.getPageContent(page)
      let menuItems = []

      if (page === PageSlug.COURSES) {
        menuItems = this.getCoursesMenuItems(pageContent);
      } else if (pageContent.subPages) {
        menuItems = this.getSubPagesMenuItems(pageContent);
      }


      this.setState({ menuItems })
      console.log(`Done with getting submenus: ${menuItems}`);
      console.log({ menuItems });
      resolve()
    })
  }

  // getSubMenu = (page) => {
  //   return new Promise(async resolve => {
  //     const mainMenuItems = await cms.mainMenuItems()
  //     const pageMenuItems = mainMenuItems.find(mainItem => mainItem.url === '/' + page)
  //     const menuItems = pageMenuItems.subItems || []
  //     this.setState({ menuItems })
  //     resolve()
  //   })
  // }

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
        <Col xs="3" className='sub-menu-container'>
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
