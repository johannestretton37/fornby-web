const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')

admin.initializeApp(functions.config().firebase)

const updateSlug = (id, eventSnapshot) => {
  const addedItem = eventSnapshot.val()
  const slug = getSlug(addedItem.name, { lang: 'sv' })
  return eventSnapshot.ref.child('slug').set(slug)
}

// Add slug when new courses are added
exports.addSlugToCourse = functions.database
  .ref('/flamelink/environments/production/content/{page}/en-US/{contentId}')
  .onWrite(event => {
    const eventSnapshot = event.data
    if (!eventSnapshot.exists()) {
      // This is a delete action, do nothing
      console.log('Item deleted - no need for slug creation')
      return null
    }

    const id = event.params.contentId
    // Create/update slug whenever something changes
    return updateSlug(id, eventSnapshot)
  })

