const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')

admin.initializeApp(functions.config().firebase)

const updateSlug = (id, eventSnapshot) => {
  const addedItem = eventSnapshot.val()
  const slug = getSlug(addedItem.name, { lang: 'sv' })
  return eventSnapshot.ref.child('slug').set(slug)
}

// Add slug when new content is added
exports.addSlug = functions.database
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

  // Copy production data to temp if someone starts editing a site
  exports.editMode = functions.database
    .ref('/flamelink/environments/production/content/{page}/en-US/{contentId}')
    .onWrite(event => {
      const eventSnapshot = event.data
      const editedItem = eventSnapshot.val()
      // If no isEditing switch exists, do nothing
      if (editedItem.isEditing === undefined) {
        console.log('isEditing is undefined, return null')
        return null
      }
      if (editedItem._prodContent) return null
      // Check if isEditing was switched
      if (eventSnapshot.previous.isEditing === true && editedItem.isEditing === true) {
        // No change
        console.log(`prev.isEditing (${eventSnapshot.previous.isEditing}) === item.isEditing (${editedItem.isEditing}), return null`)
        return null
      } else if (editedItem.isEditing) {
        // Switched from false to true, go into edit mode
        console.log('Switched from false to true, go into edit mode')
        // Store all variables in editingObject
        return eventSnapshot.ref.child('_prodContent').set(eventSnapshot.previous.val())
      } else {
        // Switched from true to false, publish and clean up
        console.log('Switched from true to false, publish and clean up')
        return eventSnapshot.ref.child('_prodContent').remove()
      }
    })

