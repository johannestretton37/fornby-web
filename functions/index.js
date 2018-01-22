
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// Add slug when new courses are added
exports.addSlugToCourse = functions.database.ref('/flamelink/environments/production/content/kurser/en-US/{courseId}')
  .onWrite(event => {
    const id = event.params.courseId
    const addedCourse = event.data.val()
    console.log('Someone edited a course:', id, addedCourse);
    return event.data.ref.child('slug').set('this-is-a-course-slug')
  }
)
