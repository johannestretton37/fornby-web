const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')

const updateSlug = (id, deltaSnapshot) => {
  const addedItem = deltaSnapshot.val()
  const slug = getSlug(addedItem.name, { lang: 'sv' })
  return deltaSnapshot.ref.child('slug').set(slug)
}

/**
 * Add or update slug (friendly url) when new content is added
 * If content has a `name` property, create a slug from it
 */
exports.addOrUpdateSlug = functions.database
  .ref('/flamelink/environments/production/content/{page}/en-US/{contentId}')
  .onWrite(event => {
    const deltaSnapshot = event.data
    if (!deltaSnapshot.exists()) {
      // This is a delete action, do nothing
      console.log('Item deleted - no need for slug creation')
      return null
    }
    // The item that was written
    const editedItem = deltaSnapshot.val()
    if (!deltaSnapshot.previous.exists()) {
      // This is a creation, create slug
      console.log('This is a creation, create slug')
      const id = event.params.contentId
      return updateSlug(id, deltaSnapshot)
    } else {
      // This is an update, update slug if it changed
      // The previous item (before write took place)
      const prevItem = deltaSnapshot.previous.val()
      if (editedItem.name !== prevItem.name) {
        // `name` property changed, update slug
        console.log('name property changed, update slug')
        const id = event.params.contentId
        return updateSlug(id, deltaSnapshot)
      } else {
        // No change detected
        console.log('No change to name property detected, return null')
        return null
      }
    }
  })
