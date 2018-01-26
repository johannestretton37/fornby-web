import getSlug from 'speakingurl'
import firebaseApp from '../Fire'
import flamelink from 'flamelink'
import { ContentGroup } from '../constants'

/**
 * CMS
 *
 * This is an API for the Content Managing System. It is meant as a middleware for accessing
 * content while we decide what technical solution we're gonna use.
 */

class CMS {
  constructor() {
    this.flamelinkApp = flamelink({ firebaseApp })
    this.cache = {}
    this.getBasicInfo()
  }

  /**
   * Get basic info, such as navigation, page headlines and such
   */
  getBasicInfo = () => {
    return Promise.all([
      this.mainMenuItems(),
      this.getSlides()
    ])
  }

  createMainMenuItem = (item, parent) => {
    let { id, title, url, cssClass } = item
    let separator = (url.indexOf('#') !== -1) ? '#' : '/'
    let slug = separator + getSlug(title, { lang: 'sv' })
    if (parent) {
      slug = parent.url + slug
    }
    return {
      id,
      title,
      url: slug,
      cssClass
    }
  }
  /**
   * Main Menu
   */
  mainMenuItems = () => {
    return new Promise(async resolve => {
      // Return cached main menu if present
      if (this.cache.mainMenu) return resolve(this.cache.mainMenu)
      const mainNavigation = await this.flamelinkApp.nav.get('mainNavigation', {
        fields: ['items']
      })
      // Structure menu
      let mainMenu = []
      mainNavigation.items.forEach(item => {
        if (item.parentIndex === 0) {
          // This is a root link, e.g. '/kurser'
          mainMenu.push(this.createMainMenuItem(item))
        } else {
          // This is a sub link, e.g. '/kurser/mer-info'
          // Find parent and add child to parent's subItems array
          // We can assume that the parent is already added to mainMenu, 
          // search from end of array
          const array = mainMenu
          let parent = this.findParentFor(item, array)
          if (parent) {
            if (!parent.subItems) parent.subItems = []
            parent.subItems.push(this.createMainMenuItem(item, parent))
          }
        }
      })
      this.cache.mainMenu = mainMenu
      resolve(mainMenu)
    })
  }

  /**
   * Helper function to find a parent for a child
   * This method will search recursively through passed
   * array and return a parent object if found
   * 
   * @param {object} item - The child that searches for its' parent
   * @param {array} array - The array to search through
   * 
   * @returns - An `object` that is the child's parent, or `undefined` if search fails
   */
  findParentFor = (item, array) => {
    let parent
    let i = array.length - 1
    while (parent === undefined && i >= 0) {
      const possibleParent = array[i]
      if (possibleParent.id === item.parentIndex) {
        parent = possibleParent
      } else if (possibleParent.subItems) {
        return this.findParentFor(item, possibleParent.subItems)
      }
      i--
    }
    return parent
  }

  /**
   * Return an array of content objects
   *
   * @param {string} group - The name of the group to get. Defaults to `ContentGroup.COURSES` ('kurser')
   * @param {object} options - The property fields to get. Defaults to `{ fields: ['id', 'name', 'shortInfo'] }`
   * @param {boolean} cacheResponse - If set to true (or omitted) the response will be cached into `this.cache`
   * @returns - A Promise that resolves to an array of objects
   */
  getContentGroup = (
    group = ContentGroup.COURSES,
    options = { fields: ['id', 'name', 'slug', 'shortInfo'] },
    cacheResponse = true
  ) => {
    // Convert group name from friendly URL to camelCase
    group = this.camelCase(group)
    return new Promise(async resolve => {
      // Return cached group if present
      if (this.cache[group]) return resolve(this.cache[group])
      const contentData = await this.flamelinkApp.content.get(group, options)
      let content = this.arrayFromFirebaseData(contentData)
      if (cacheResponse) {
//        this.registerSlugs(content, group)
        this.cache[group] = content
      }
      console.log('CMS Cache\n', this.cache)
      resolve(content)
    })
  }

  camelCase = string => {
    const words = string.toLowerCase().split('-')
    return words.map((word, i) => {
      if (i === 0) return word
      return word[0].toUpperCase() + word.substr(1)
    }).join('')
  }
  /**
   * Return a single content object
   * @param {string} group - A string representing a group, e.g. 'kurser'
   * @param {string} slug - A string representing a slug, e.g. 'konstkurs-VT-18'
   * @returns - A Promise that resolves to a content object
   */
  getContent = (group, slug) => {
    return new Promise(async (resolve, reject) => {
      try {
        let id = this.idFromSlug(group, slug)
        if (!id) {
          await this.getContentGroup(group, { fields: ['id', 'name'] })
          id = this.idFromSlug(group, slug)
          if (!id) reject(`Kunde inte hitta /${group}/${slug}`)
        }
        const content = await this.flamelinkApp.content.get(group, id)
        resolve(content)
      } catch (error) {
        reject(error)
      }
    })
  }

  getURL = id => {
    return this.flamelinkApp.storage.getURL(id, { size: 'device' })
  }
  /**
   * Fetch images for the start page carousel
   * @returns - A Promise that resolves to an array of objects, e.g.
   * {
   *   title: 'Image Headline',
   *   subtitle: 'A short text',
   *   image: 'http://www.example.com/path/to/image/file.jpg'
   * }
   */
  getSlides = () => {
    return new Promise(async (resolve, reject) => {
      // Get all slides
      try {
        const slides = await this.getContentGroup(
          ContentGroup.START_PAGE_SLIDES,
          {
            fields: ['title', 'alt', 'subtitle', 'image'],
            populate: ['image']
          }
        )
        resolve(slides)
      } catch (error) {
        reject(error)
      }
    })
  }

  subscribeToCourses = callback => {
    this.flamelinkApp.content.subscribe(
      ContentGroup.COURSES,
      (error, coursePages) => {
        let courses = this.arrayFromFirebaseData(coursePages, [
          'id',
          'name',
          'slug',
          'shortInfo'
        ])
        callback(courses)
      }
    )
  }

  /**
   * Helper function to transform a firebase object into an array
   * @param data - The data returned from a flamelink operation, such as `get`
   * @returns - An array of objects
   */
  arrayFromFirebaseData = data => {
    let array = []
    if (!data) return array
    Object.values(data).forEach(value => {
      let result = {}
      Object.entries(value).forEach(([field, val]) => {
        result[field] = val
      })
      if (result.slug === undefined && result.name !== undefined) {
        console.warn('Didn\'t find a slug - creating one from', result.name)
        result.slug = getSlug(result.name)
      }
      array.push(result)
    })
    return array
  }

  idFromSlug = (group, slug) => {
    if (!this.cache[group]) return undefined
    let ids = this.cache[group].filter(member => {
      return member.slug === slug
    })
    return ids.length > 0 ? ids[0].id : undefined
  }

}

const cms = new CMS()
export default cms
