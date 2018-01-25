import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cms from '../../cms'
import ImagePreLoader from '../ImagePreLoader'
import './Page.css'
import DateHelper from '../../Helper'

/**
 * A generic component that will display detailed information about
 * something, e.g. a course
 */
class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: {},
      mainImageURL: ''
    }
  }
  static propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    children: PropTypes.any
  }
  componentDidMount() {
    this.getContent(this.props.match.params.page, this.props.match.params.slug)
  }

  getContent = async (group, id) => {
    try {
      let content = await cms.getContent(group, id)
      this.setState({ content })
      if (content.mainImage) {
        let mainImageURL = await cms.getURL(content.mainImage[0])
        this.setState({ mainImageURL })
      }
    } catch (error) {
      const parentPath = this.props.location.pathname.replace(`/${id}`, '')
      console.error(error)
      this.props.history.push(parentPath)
    }
  }
  getFormatedDate(date) {
    let s = new Date(date);
    var options = { day: 'numeric', month: 'long', year: 'numeric' };

    return s.toLocaleDateString('sv', options);
  }
  render() {
    const { content: { name, shortInfo, summary, mainBody, mainImage, previewImg, applicationDeadline, courseStartDate }, mainImageURL } = this.state
    // MOCK
    const previewImgMock = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAAAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDNjdGODU2RkY3QTUxMUU3QTZGNUFGQjVBQTIzNDE4QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDNjdGODU3MEY3QTUxMUU3QTZGNUFGQjVBQTIzNDE4QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM2N0Y4NTZERjdBNTExRTdBNkY1QUZCNUFBMjM0MThCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkM2N0Y4NTZFRjdBNTExRTdBNkY1QUZCNUFBMjM0MThCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAGxoaKR0pQSYmQUIvLy9CRz8+Pj9HR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHRwEdKSk0JjQ/KCg/Rz81P0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dH/8AAEQgANABQAwEiAAIRAQMRAf/EAGwAAAIDAQEAAAAAAAAAAAAAAAIDAAEEBQYBAQEBAQAAAAAAAAAAAAAAAAEAAgMQAAICAQMDAwMFAAAAAAAAAAABEQIhMRIDUWEEQXGR8IEiweETIwURAQADAQAAAAAAAAAAAAAAAAABERIh/9oADAMBAAIRAxEAPwDukk81Tm5FpZ/LNHH5PKpm3yY06ZdzclqVS6vp7HnL89suzkPi8y1X+GH01TDSy9EUK4eRclFeI3Ia7I0ysFqStxW6SSOoLr2CdoBdiTicVvGbxeyfsar+GuRfhdM4UWu1tTwNpfkThTuRz46dbrf5nL2+QuDxXW22ydV6zlOOnQ1eJ5L5KNWblM0tzgl1l28vFy0pW39TemMdvbodCOplvVxj0yU7WKxTbhFwjErsNXdVA6FNDQuUB/Iy9/oNwqef4+G98JG/x/HFbfZy4jAdONUWPUNJnOWzVDygtRNdeg1Y0C0FPMWj3GagavOg2vToMCSoaBW5Y6jYcxJNr7FSLmMMtBvPuLc+8Cg32z+Ex3LRCChqPUrHp9fqQhmSGmmdM/t9xy7EIUCVuYxqBeYIQZAXr3KerjX6+xCAX//2Q=='
    // END MOCK
    return (
      <div>
        <h2>{name}</h2>
        <p className='summary'>{summary}</p>
        <h4>Startdatum: {DateHelper.formatDate(courseStartDate)}</h4>
        <h4>Sista ansökningsdagen: {DateHelper.formatDate(applicationDeadline)}</h4>
        {mainImage &&
          <ImagePreLoader previewImg={previewImgMock}>
            <img src={mainImageURL} alt={name} />
          </ImagePreLoader>
        }
        <div className='main-body' dangerouslySetInnerHTML={{ __html: mainBody }} />
        {this.props.children}
      </div>
    )
  }
}



export default Page
