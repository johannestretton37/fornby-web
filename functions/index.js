const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')

admin.initializeApp(functions.config().firebase)

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

/**
 * Copy production data to _prodContent property if someone is editing a site
 */
exports.editDetected = functions.database
  .ref('/flamelink/environments/production/content/{page}/en-US/{contentId}')
  .onWrite(event => {
    const deltaSnapshot = event.data
    if (!deltaSnapshot.exists()) {
      // This is a delete action, do nothing
      console.log('Item deleted, return null')
      return null
    }
    // The item that was written
    const editedItem = deltaSnapshot.val()
    console.log('Write detected', editedItem)
    // If no isEditing switch exists, do nothing
    if (editedItem.isEditing === undefined) {
      console.log('isEditing is undefined, return null')
      return null
    }
    // Prevent recursive loop
    if (editedItem._prodContent) {
      console.log('_prodContent found - meaning this is already a _prodContent object, return null')
      return null
    }
    if (deltaSnapshot.previous.exists()) {
      // This is an update
      // The previous item (before write took place)
      const prevItem = deltaSnapshot.previous.val()
      // Check if isEditing was switched
      console.log(
        `[isEditing]: prev.isEditing (${
          prevItem.isEditing
        }) === writtenItem.isEditing (${editedItem.isEditing})`
      )
      if (
        prevItem.isEditing === true && editedItem.isEditing === true
      ) {
        // Still in edit mode, update _prodContent
        console.log(
          `Still in edit mode, prev.isEditing (${
            prevItem.isEditing
          }) === item.isEditing (${editedItem.isEditing}), update _prodContent`
        )
        // Update 
        return deltaSnapshot.ref.child('_prodContent').set(prevItem._prodContent)
      }
      if (prevItem.isEditing === false && editedItem.isEditing === true) {
        // Switched from false to true, go into edit mode
        console.log('Switched from false to true, go into edit mode')
        // Store all variables in editingObject
        return deltaSnapshot.ref
          .child('_prodContent')
          .set(prevItem)
      }
      if (prevItem.isEditing === true && editedItem.isEditing === false) {
        // Switched from true to false, publish and clean up
        console.log('Switched from true to false, publish and clean up')
        return deltaSnapshot.ref.child('_prodContent').remove()
      }
    } else {
      // This is a creation
      if (editedItem.isEditing === true) {
        console.log('Init item with _prodContent')
        return deltaSnapshot.ref
          .child('_prodContent')
          .set(editedItem)
      } else {
        console.log('Created item was released straight to prod, return null')
        return null
      }
    }
    console.log('Did nothing')
    return null
  })
