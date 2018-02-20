const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')

const gcs = require('@google-cloud/storage')()
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')
const imageDataURI = require('image-data-uri')

admin.initializeApp(functions.config().firebase)

/**
 * Monitor edits to content
 *
 * Add or update slug
 * Add or update preview dataURI
 * Copy production data to _prodContent property if someone is editing a site
 */
exports.contentChangeDetected = functions.database
  .ref('/flamelink/environments/production/content/{page}/en-US/{contentId}')
  .onWrite(event => {
    const deltaSnapshot = event.data
    if (!deltaSnapshot.exists()) {
      // This is a delete action, do nothing
      return null
    }
    // The item that was written
    const editedItem = deltaSnapshot.val()
    // If no isEditing switch exists, do nothing
    if (editedItem.isEditing === undefined) {
      return null
    }
    // Prevent recursive loop
    if (editedItem._prodContent) {
      return null
    }
    // Store all edit promises
    let edits = []
    // Update or creation?
    if (deltaSnapshot.previous.exists()) {
      // This is an update
      // The previous item (before write took place)
      const prevItem = deltaSnapshot.previous.val()
      /**
       * Slug
       * Every entry that has a name property needs a slug property,
       * a friendly url.
       */
      if (prevItem.slug) {
        if (prevItem.name !== editedItem.name) {
          const slug = getSlug(editedItem.name, { lang: 'sv' })
          console.log('update slug', prevItem.slug, '=>', slug)
          edits.push(deltaSnapshot.ref.child('slug').set(slug))
        } else {
          console.log('preserve slug')
          edits.push(deltaSnapshot.ref.child('slug').set(prevItem.slug))
        }
      } else if (editedItem.name) {
        // Create slug
        const slug = getSlug(editedItem.name, { lang: 'sv' })
        console.log('create slug:', slug)
        edits.push(deltaSnapshot.ref.child('slug').set(slug))
      }
      /**
       * Previews
       * If entry has an images array, we need to add a preview array,
       * containing dataURI thumbnails
       */
      if (prevItem.previews) {
        // Check if there are images, otherwise there's no need for previews
        if (editedItem.images) {
          // Images exist, check for changes
          if (
            prevItem.images.length === editedItem.images.length &&
            prevItem.images.every((val, i) => val === editedItem.images[i])
          ) {
            // No change to images, preserve previews
            console.log('preserve previews', prevItem.previews)
            edits.push(
              deltaSnapshot.ref.child('previews').set(prevItem.previews)
            )
          } else {
            console.log(`[TODO:] WE SHOULD CREATE PREVIEWS FOR ${editedItem}`)
            // let previewPromises = []
            // editedItem.images.forEach(imageId => {
            //   previewPromises
            // })
            // edits.push()
          }
        }
      }

      /**
       * Edit mode
       * When someone create/edits content a _prodContent property will be added.
       * If `isEditing` is true, this _prodContent will be displayed in production
       * and the content being edited will be shown on staging site (and in dev environment)
       */
      // Check if isEditing was switched
      if (prevItem.isEditing === true && editedItem.isEditing === true) {
        // Still in edit mode, update _prodContent
        edits.push(
          deltaSnapshot.ref.child('_prodContent').set(prevItem._prodContent)
        )
        return Promise.all(edits)
      }
      if (prevItem.isEditing === false && editedItem.isEditing === true) {
        // Switched from false to true, go into edit mode
        console.log('Switched from false to true, go into edit mode')
        // Store all variables in editingObject
        edits.push(deltaSnapshot.ref.child('_prodContent').set(prevItem))
        return Promise.all(edits)
      }
      if (prevItem.isEditing === true && editedItem.isEditing === false) {
        // Switched from true to false, publish and clean up
        console.log('Switched from true to false, publish and clean up')
        edits.push(deltaSnapshot.ref.child('_prodContent').remove())
        return Promise.all(edits)
      }
      if (editedItem.isEditing === false) {
        // Remove any trash
        console.log(
          'Item saved with isEditing set to false, clean up any leftovers'
        )
        edits.push(deltaSnapshot.ref.child('_prodContent').remove())
        return Promise.all(edits)
      }
    } else {
      // This is a creation
      if (editedItem.isEditing === true) {
        console.log('Init item with _prodContent')
        edits.push(deltaSnapshot.ref.child('_prodContent').set(editedItem))
        return Promise.all(edits)
      } else {
        console.log(
          'Created item was released straight to prod, ignore _prodContent'
        )
        return Promise.all(edits)
      }
    }
    console.log('Did nothing, should I have? edits array has', edits.length, 'entries.')
    return null
  })

exports.addPreview = functions.database
  .ref(
    '/flamelink/environments/production/content/{page}/en-US/{contentId}/images/{imageIndex}'
  )
  .onWrite(event => {
    const deltaSnapshot = event.data
    if (!deltaSnapshot.exists()) {
      // This is a delete action, do nothing
      console.log('Image[' + event.params.imageIndex + '] deleted - do nothing')
      return null
    }
    // The item that was written
    const imageId = deltaSnapshot.val()
    if (!deltaSnapshot.previous.exists()) {
      // This is a creation, add preview
      console.log('Add preview to imageId:', imageId)
      // Get preview
      return deltaSnapshot.ref.root
        .child(`/previews/${imageId}`)
        .once('value')
        .then(snapshot => {
          let preview = snapshot.val()
          return deltaSnapshot.ref.parent.parent.child('previews').set({
            [event.params.imageIndex]: preview
          })
        })
    } else {
      // This is an update, update dataURI if it changed
      // The previous item (before write took place)
      console.log('[TODO:] This is an update to images!')
      const prevItem = deltaSnapshot.previous.val()
      console.log('[TODO:] check if image changed', prevItem)
      return null
      // if (editedItem.name !== prevItem.name) {
      //   // `name` property changed, update slug
      //   console.log('name property changed, update slug')
      //   const id = event.params.contentId
      //   return updateSlug(id, deltaSnapshot)
      // } else {
      //   // No change detected
      //   console.log('No change to name property detected, return null')
      //   return null
      // }
    }
  })

exports.imageChangeDetected = functions.storage.object().onChange(event => {
  const object = event.data // The Storage object.
  const fileBucket = object.bucket // The Storage bucket that contains the file.
  const filePath = object.name // File path in the bucket.
  const contentType = object.contentType // File content type.
  const resourceState = object.resourceState // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  const metageneration = object.metageneration // Number of times metadata has been generated. New objects have a value of 1.
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.')
    return null
  }

  // Get the file name and flamelink id.
  const fileName = path.basename(filePath)
  const match = /^([0-9]*)_/.exec(fileName)
  const fileId = match !== null ? match[1] : 0

  if (filePath.includes('/sized/')) {
    console.log('Ignore resized image')
    return null
  }

  // Exit if this is a move or deletion event.
  if (resourceState === 'not_exists') {
    console.log(fileName, 'deleted. Remove previews/' + fileId)
    // Delete previews
    return admin
    .database()
    .ref(`/previews/${fileId}`)
    .remove()
  }

  // Exit if file exists but is not new and is only being triggered
  // because of a metadata change.
  if (resourceState === 'exists' && metageneration > 1) {
    console.log('This is a metadata change event.')
    return null
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket)
  const tempFilePath = path.join(os.tmpdir(), fileName)
  return bucket
    .file(filePath)
    .download({
      destination: tempFilePath
    })
    .then(() => {
      // Generate a thumbnail using ImageMagick.
      return spawn('convert', [tempFilePath, '-resize', '20x20>', tempFilePath])
    })
    .then(() => {
      console.log('Thumbnail created')
      return imageDataURI.encodeFromFile(tempFilePath)
    })
    .then(dataURI => {
      console.log('dataURI created')
      let preview = {
        dataURI,
        color: '#fff'
      }
      return spawn('convert', [tempFilePath, '-resize', '1x1', 'txt:'], {capture: ['stdout']}).then(result => {
        let regex = /#([A-F0-9]){6}/gi
        let matches = regex.exec(result.stdout)
        if (matches != null) {
          preview.color = matches[0]
        }
        console.log('STDOUT:', result.stdout.toString())
        return preview
      })
    })
    .then(preview => {
      return admin
        .database()
        .ref(`/previews/${fileId}`)
        .set(preview)
    })
    .then(() => {
      fs.unlinkSync(tempFilePath)
    })
  // [END thumbnailGeneration]
})
