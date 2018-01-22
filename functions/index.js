
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getSlug = require('speakingurl')
admin.initializeApp(functions.config().firebase)

const updateSlug = (id, eventSnapshot) => {
    const addedCourse = eventSnapshot.val()
    const slug = getSlug(addedCourse.name)
    console.log('Someone added or edited a course:', id, addedCourse);
    console.log('Created slug:', slug);
    return eventSnapshot.ref.child('slug').set(slug)
}
// Add slug when new courses are added
exports.addSlugToCourse = functions.database.ref('/flamelink/environments/production/content/kurser/en-US/{courseId}')
  .onWrite(event => {
    const eventSnapshot = event.data
    if (!eventSnapshot.exists()) {
      // This is a delete action, do nothing
      console.log('Course deleted - no need for slug creation')
      return null
    }

    const id = event.params.courseId
    if (eventSnapshot.previous.exists()) {
      // Course already exists, this is an edit
      let courseName = eventSnapshot.child('name')
      if (courseName.changed()) {
        // `name` has been altered, update slug
        console.log('Course name has been altered - update slug')
        return updateSlug(id, eventSnapshot)
      }
    } else {
      // Course doesn't exist, this is a create
      console.log('Course doesn\'t exist - create slug')
      return updateSlug(id, eventSnapshot)
    }
  }
)
