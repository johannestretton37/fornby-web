import getSlug from 'speakingurl'
import firebaseApp from '../Fire'
import flamelink from 'flamelink'

/**
 * CMS
 * 
 * This is an API for the Content Managing System. It is meant as a middleware for accessing 
 * content while we decide what technical solution we're gonna use.
 */

class CMS {
  constructor() {
   this.flamelinkApp = flamelink({firebaseApp})
   console.log('CMS Inited')
  }
  /**
   * Return an array of course objects
   * @returns - A Promise that resolves to an array of curse objects
   */
  courses = () => {
    return new Promise(async resolve => {
      const coursePages = await this.flamelinkApp.content.get('coursePages')
      let courses = this.arrayFromFirebaseData(coursePages, ['id', 'name', 'shortInfo'])
      resolve(courses)
    })
  }
  
  subscribeToCourses = (callback) => {
    this.flamelinkApp.content.subscribe('coursePages', (error, coursePages) => {
      let courses = this.arrayFromFirebaseData(coursePages, ['id', 'name', 'shortInfo'])
      callback(courses)
    })
  }
  
  /**
   * Helper function to transform a firebase object into an array
   * @param data - The data returned from a flamelink operation, such as `get`
   * @param fields - An array of strings, responding to the properties to extract
   * @returns - An array of objects
   */
  arrayFromFirebaseData = (data, fields) => {
    let array = []
    Object.entries(data).forEach(([entry, value]) => {
      let result = {}
      fields.forEach(field => {
        if (field === 'name') result.slug = getSlug(value[field])
        result[field] = value[field]
      })
      array.push(result)
    })
    return array
  }
}

const cms = new CMS()
export default cms
