import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { string, object } from 'prop-types'
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap'
import Gallery from '../Gallery'
import PageContainer from '../PageContainer'
import cms from '../../cms'
import './GalleryPage.css'

/**
 * GalleryPage keeps track of what content to display
 * It renders a `Gallery` component which then displays the content
 */
class GalleryPage extends Component {
  state = {
    galleryItems: [],
    selectedFilial: []
  }

  static propTypes = {
    title: string.isRequired,
    match: object.isRequired
  }

  componentDidMount() {
    this.getContent(this.props.match.path.replace('/', ''))
  }

  getContent = async contentType => {
    // Get content
    const content = await cms.getContentGroup(contentType)
    this.setState({
      galleryItems: content
    })
  }

  selectFilial = filial => {
    const index = this.state.selectedFilial.indexOf(filial)
    if (index < 0) {
      this.state.selectedFilial.push(filial)
    } else {
      this.state.selectedFilial.splice(index, 1)
    }
    this.setState({ selectedFilial: [...this.state.selectedFilial] })
  }

  render() {
    const { title } = this.props
    const filials = [
      {
        slug: 'borlange',
        name: 'Borlänge'
      },
      {
        slug: 'ludvika',
        name: 'Ludvika'
      },
      {
        slug: 'falun',
        name: 'Falun'
      }
    ]
    return (
      <section>
        <Container>
          <Switch>
            <Route
              path="/:page/:slug"
              render={props => (
                <PageContainer
                  title={title}
                  {...props}
                  items={this.state.galleryItems}
                />
              )}
            />
            <Route
              render={() => {
                return (
                  <div>
                    <Row>
                      <Col>
                        <h2>{title}</h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>[Eventuellt en sorteringsfunktion här?]</p>
                        <p>Visa endast kurser som hålls i</p>
                        <ButtonGroup style={{ paddingBottom: '20px' }}>
                          {filials.map(filial => {
                            return (
                              <Button
                                color="primary"
                                key={filial.slug}
                                onClick={() => this.selectFilial(filial.slug)}
                                active={this.state.selectedFilial.includes(
                                  filial.slug
                                )}
                              >
                                {filial.name}
                              </Button>
                            )
                          })}
                        </ButtonGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Gallery items={this.state.galleryItems} />
                      </Col>
                    </Row>
                  </div>
                )
              }}
            />
          </Switch>
        </Container>
      </section>
    )
  }
}

export default withRouter(GalleryPage)
