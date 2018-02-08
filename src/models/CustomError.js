class CustomError {
  constructor (title, message, showSearch, rescueLink, rescueText) {
    this.title = title
    this.message = message
    // If true, display a search field below the message
    this.showSearch = showSearch
    // If rescueLink is not undefined, a link button with a
    // rescueText will be shown
    this.rescueLink = rescueLink
    this.rescueText = rescueText
  }
}

export default CustomError
