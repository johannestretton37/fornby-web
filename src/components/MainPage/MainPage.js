import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import GalleryPage from '../GalleryPage'
import CoursesPage from '../CoursesPage'
import Loading from '../Loading'
import PagesContainer from '../PagesContainer'
import { Container, Row, Col } from 'reactstrap'
import SubMenu from '../SubMenu'
import cms from '../../cms'
import './MainPage.css'
import PageContainer from '../PageContainer/PageContainer'

/**
 * MainPage
 */
class MainPage extends Component {
  state = {
    isLoading: true,
    title: ''
  }

  static propTypes = {
    match: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.loadTitle()
  }

  loadTitle = async () => {
    let mainMenuItems = await cms.mainMenuItems()
    let activeItem = mainMenuItems.find(item => item.url === this.props.match.url)
    this.setState({
      title: activeItem.title,
      isLoading: false
    })
  }

  render() {
    const { category} = this.props.match.params
    const { isLoading, title } = this.state
    return (
      <Container>
        <Row>
          <SubMenu />
          <Col>
            {isLoading ? <Loading /> :
              <Switch>
                <Route path='/kurser/:category?/:slug?' component={CoursesPage}/*render={props => <CoursesPage {...props} title={title} }/> */ />
                <Route path='/:page/:subpage?' component={PagesContainer} />
                <Route path='/:page' component={PageContainer} />
              </Switch>}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default MainPage
