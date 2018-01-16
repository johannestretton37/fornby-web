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
  this.index = {
    courses: {}
  }
}

  /**
   * Main Menu
   */
  mainMenuItems = () => {
    return new Promise(async resolve => {
      const mainMenu = await this.flamelinkApp.nav.get('mainNavigation', { fields: ['items']})
      resolve(mainMenu.items)
    })
  }
  
  /**
   * Return an array of course objects
   * @returns - A Promise that resolves to an array of course objects
   */
  courses = () => {
    return new Promise(async resolve => {
      const coursePages = await this.flamelinkApp.content.get('coursePages')
      let courses = this.arrayFromFirebaseData(coursePages, ['id', 'name', 'shortInfo'])
      this.registerSlugs(courses, 'courses')
      resolve(courses)
    })
  }

  /**
   * Return an array of content objects
   * @returns - A Promise that resolves to an array of objects
   */
  getContentGroup = (group) => {
    return new Promise(async resolve => {
      let table = 'coursePages'
      const contentData = await this.flamelinkApp.content.get(table)
      let content = this.arrayFromFirebaseData(contentData, ['id', 'name', 'shortInfo'])
      this.registerSlugs(content, 'courses')
      resolve(content)
    })
  }

  getContent = (group, slug) => {
    if (group !== 'kurser') throw new Error('This is only implemented for "kurser" yet')
    return new Promise(async (resolve, reject) => {
      let id = this.idFromSlug(slug)
      if (!id) {
        await this.courses()
        id = this.idFromSlug(slug)
        if (!id) reject('Kunde inte hitta kurs')
      }
      const course = await this.flamelinkApp.content.get('coursePages', id)
      // let course = this.arrayFromFirebaseData(coursePage, ['id', 'name', 'shortInfo'])
      resolve(course)
    })
  }

  /**
   * Return a single course object
   * @returns - A Promise that resolves to a course objects
   */
  course = (slug) => {
    return new Promise(async (resolve, reject) => {
      let id = this.idFromSlug(slug)
      if (!id) {
        await this.courses()
        id = this.idFromSlug(slug)
        if (!id) reject('Kunde inte hitta kurs')
      }
      const coursePage = await this.flamelinkApp.content.get('coursePages', id)
      let course = this.arrayFromFirebaseData(coursePage, ['id', 'name', 'shortInfo'])
      resolve(course)
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
        if (field === 'name') {
          result.slug = getSlug(value[field])
        }
        result[field] = value[field]
      })
      array.push(result)
    })
    return array
  }

  idFromSlug = (slug, itemType = 'courses') => {
    return this.index[itemType] ? this.index[itemType][slug] : undefined
  }

  registerSlugs = (items, itemType = 'courses') => {
    if (!this.index[itemType]) this.index[itemType] = {}
    let index = this.index[itemType]
    items.forEach(item => {
      index[item.slug] = item.id
    })
  }
}

const cms = new CMS()
export default cms
