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
    this.index = {}
    this.cache = {}
    this.getBasicInfo()
  }

  /**
   * Get basic info, such as navigation, page headlines and such
   */
  getBasicInfo = () => {
    return Promise.all([this.mainMenuItems(), this.getSlides()])
  }

  /**
   * Main Menu
   */
  mainMenuItems = () => {
    return new Promise(async resolve => {
      // Return cached main menu if present
      if (this.cache.mainMenu) return resolve(this.cache.mainMenu)
      const mainMenu = await this.flamelinkApp.nav.get('mainNavigation', {
        fields: ['items']
      })
      this.cache.mainMenu = mainMenu.items
      resolve(mainMenu.items)
    })
  }

  /**
   * Return an array of content objects
   *
   * @param {string} group - The name of the group to get. Defaults to `ContentGroup.COURSES` ('coursePages')
   * @param {array} fields - The property fields to get. Defaults to `['id', 'name', 'shortInfo']`
   * @param {boolean} cacheResponse - If set to true (or omitted) the response will be cached into `this.cache`
   * @returns - A Promise that resolves to an array of objects
   */
  getContentGroup = (
    group = ContentGroup.COURSES,
    fields = ['id', 'name', 'shortInfo'],
    cacheResponse = true
  ) => {
    console.log('Getting Content for Group', group, 'isCached:', this.cache[group] !== undefined)
    return new Promise(async resolve => {
      // Return cached group if present
      if (this.cache[group]) return resolve(this.cache[group])
      const contentData = await this.flamelinkApp.content.get(group, { fields })
      let content = this.arrayFromFirebaseData(contentData)
      if (cacheResponse) {
        this.registerSlugs(content, group)
        this.cache[group] = content
      }
      console.log('CMS Cache\n', this.cache)
      console.log('CMS Slug Index\n', this.index)
      resolve(content)
    })
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
          await this.getContentGroup(group, ['name'], true)
          id = this.idFromSlug(group, slug)
          if (!id) reject(`Kunde inte hitta ${group}/${slug}`)
        }
        const content = await this.flamelinkApp.content.get(group, id)
        resolve(content)
      } catch (error) {
        reject(error)
      }
    })
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
          { fields: ['title', 'subtitle', 'image'] }
        )
        let slideItems = []
        let promises = []
        // Loop through slides and fetch url for all images
        Object.values(slides).forEach(slide => {
          let item = {
            title: slide.title,
            subtitle: slide.subtitle,
            alt: slide.alt
          }
          promises.push(
            this.flamelinkApp.storage
              .getURL(slide.image[0], { size: 'device' })
              .then(url => {
                item.image = url
                slideItems.push(item)
              })
          )
        })
        // Wait for all promises to resolve
        await Promise.all(promises)
        resolve(slideItems)
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
        if (field === 'name') result.slug = getSlug(val)
      })
      array.push(result)
    })
    return array
  }

  idFromSlug = (group, slug) => {
    return this.index[group] ? this.index[group][slug] : undefined
  }

  registerSlugs = (items, group) => {
    if (!this.index[group]) this.index[group] = {}
    let index = this.index[group]
    items.forEach(item => {
      index[item.slug] = item.id
    })
  }
}

const cms = new CMS()
export default cms
