const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')

const gcs = require('@google-cloud/storage')()
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')
const imageDataURI = require('image-data-uri')

admin.initializeApp()

/**
 * Monitor edits to content
 *
 * Add or update slug
 * Add or update preview dataURI
 * Copy production data to _prodContent property if someone is editing a site
 */
exports.contentChangeDetected = functions.database
  .ref('/flamelink/environments/production/content/{page}/en-US/{contentId}')
  .onWrite((change, context) => {
    // The item that was stored previously
    const previousItem = change.before.val()
    // The item that was written now
    const editedItem = change.after.val()

    if (!change.after.exists()) {
      // This is a delete action, do nothing
      return null
    }

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
    if (change.before.exists()) {
      // This is an update
      /**
       * Slug
       * Every entry that has a name property needs a slug property,
       * a friendly url.
       */
      if (previousItem.slug) {
        console.log('Slug exists:', previousItem.slug)
        if (previousItem.name !== editedItem.name) {
          const slug = getSlug(editedItem.name, { lang: 'sv' })
          console.log('update slug', previousItem.slug, '=>', slug)
          edits.push(change.after.ref.child('slug').set(slug))
        } else {
          console.log('preserve slug')
          edits.push(change.after.ref.child('slug').set(previousItem.slug))
        }
      } else if (editedItem.name) {
        // Create slug
        const slug = getSlug(editedItem.name, { lang: 'sv' })
        console.log('create slug:', slug)
        edits.push(change.after.ref.child('slug').set(slug))
      }
      /**
       * Previews
       * If entry has an images array, we need to add a preview array,
       * containing dataURI thumbnails
       */
      if (previousItem.previews) {
        // Check if there are images, otherwise there's no need for previews
        if (editedItem.images) {
          // Images exist, check for changes
          if (
            previousItem.images.length === editedItem.images.length &&
            previousItem.images.every((val, i) => val === editedItem.images[i])
          ) {
            // No change to images, preserve previews
            console.log('preserve previews', previousItem.previews)
            edits.push(
              change.after.ref.child('previews').set(previousItem.previews)
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
      if (previousItem.isEditing === true && editedItem.isEditing === true) {
        // Still in edit mode, update _prodContent
        console.log(
          'Still in edit mode, update _prodContent',
          previousItem._prodContent
        )
        edits.push(
          change.after.ref.child('_prodContent').set(previousItem._prodContent)
        )
        return Promise.all(edits)
      }
      if (previousItem.isEditing === false && editedItem.isEditing === true) {
        // Switched from false to true, go into edit mode
        console.log('Switched from false to true, go into edit mode')
        // Store all variables in editingObject
        edits.push(change.after.ref.child('_prodContent').set(previousItem))
        return Promise.all(edits)
      }
      if (previousItem.isEditing === true && editedItem.isEditing === false) {
        // Switched from true to false, publish and clean up
        console.log('Switched from true to false, publish and clean up')
        edits.push(change.after.ref.child('_prodContent').remove())
        return Promise.all(edits)
      }
      if (editedItem.isEditing === false) {
        // Remove any trash
        console.log(
          'Item saved with isEditing set to false, clean up any leftovers'
        )
        edits.push(change.after.ref.child('_prodContent').remove())
        return Promise.all(edits)
      }
    } else {
      // This is a creation
      if (editedItem.isEditing === true) {
        console.log('Init item with _prodContent', editedItem)
        edits.push(change.after.ref.child('_prodContent').set(editedItem))
        console.log('Object created, promises:', edits)
        return Promise.all(edits)
      } else {
        console.log(
          'Created item was released straight to prod, ignore _prodContent'
        )
        return Promise.all(edits)
      }
    }
    console.log(
      'Did nothing, should I have? edits array has',
      edits.length,
      'entries.'
    )
    return null
  })

exports.addPreview = functions.database
  .ref(
    '/flamelink/environments/production/content/{page}/en-US/{contentId}/images/{imageIndex}'
  )
  .onWrite((change, context) => {
    if (!change.after.exists()) {
      // This is a delete action, do nothing
      console.log(
        'Image[' + context.params.imageIndex + '] deleted - do nothing'
      )
      return null
    }
    // The item that was written
    const imageId = change.after.val()
    if (!change.before.exists()) {
      // This is a creation, add preview
      console.log('Add preview to imageId:', imageId)
      // Get preview
      return change.after.ref.root
        .child(`/previews/${imageId}`)
        .once('value')
        .then(snapshot => {
          let preview = snapshot.val()
          return change.after.ref.parent.parent.child('previews').set({
            [context.params.imageIndex]: preview
          })
        })
    } else {
      // This is an update, update preview if it changed
      // The previous item (before write took place)
      console.log('[TODO:] This is an update to images!')
      const previousItem = change.before.val()
      console.log('[TODO:] check if image changed', previousItem)
      return null
      // if (editedItem.name !== previousItem.name) {
      //   // `name` property changed, update slug
      //   console.log('name property changed, update slug')
      //   const id = context.params.contentId
      //   return updateSlug(id, change.after)
      // } else {
      //   // No change detected
      //   console.log('No change to name property detected, return null')
      //   return null
      // }
    }
  })

exports.imageChangeDetected = functions.storage
  .object()
  .onFinalize((object, context) => {
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
    const fileId = getFileId(fileName)

    if (filePath.includes('/sized/')) {
      console.log('Ignore resized image')
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
        return spawn('convert', [
          tempFilePath,
          '-resize',
          '20x20>',
          tempFilePath
        ])
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
        return spawn('convert', [tempFilePath, '-resize', '1x1', 'txt:'], {
          capture: ['stdout']
        }).then(result => {
          let regex = /#([A-F0-9]){6}/gi
          let matches = regex.exec(result.stdout)
          if (matches != null) {
            preview.color = matches[0]
          }
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

exports.imageDeleted = functions.storage
  .object()
  .onDelete((object, context) => {
    const filePath = object.name // File path in the bucket.
    // Get the file name and flamelink id.
    const fileName = path.basename(filePath)
    const fileId = getFileId(fileName)

    console.log(fileName, 'deleted. Remove previews/' + fileId)
    // Delete previews
    return admin
      .database()
      .ref(`/previews/${fileId}`)
      .remove()
  })

function getFileId(fileName) {
  const match = /^([0-9]*)_/.exec(fileName)
  const fileId = match !== null ? match[1] : 0
  return fileId
}
