import getSlug from 'speakingurl'
import firebaseApp from '../Fire'
import flamelink from 'flamelink'
import { ContentGroup } from '../constants'
import { camelCase } from '../Helpers'

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
    // this.getBasicInfo()
  }

  /**
   * Get basic info, such as navigation, page headlines and such
   */
  getBasicInfo = () => {
    return Promise.all([this.mainMenuItems(), this.getSlides()])
  }

  createMainMenuItem = (item, parent) => {
    let { id, title, url, cssClass, order } = item
    let separator = url.indexOf('#') !== -1 ? '#' : '/'
    let slug = separator + getSlug(title, { lang: 'sv' })
    if (parent) {
      slug = parent.url + slug
    }
    if (title === 'Start') slug = '/'
    return {
      id,
      title,
      url: slug,
      cssClass,
      order
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
      return resolve(mainMenu)
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

  getDetailPages = () => {
    return new Promise(async resolve => {
      if (this.cache.detailPages) return resolve(this.cache.detailPages)
      // No cache, fetch detailPages
      const detailPagesData = await this.flamelinkApp.content.get(
        ContentGroup.DETAIL_PAGES
      )
      // Convert result to array
      const detailPages = this.arrayFromFirebaseData(detailPagesData)
      this.cache.detailPages = detailPages
      return resolve(detailPages)
    })
  }

  /**
   * Return an array of content objects
   *
   * @param {string} groupName - The name of the group to get. Example `ContentGroup.COURSES` ('kurser')
   * @param {object} options - The property fields to get. Example `{ fields: ['id', 'name', 'shortInfo'] }`
   * @param {boolean} cacheResponse - If set to true (or omitted) the response will be cached into `this.cache`
   * @returns - A Promise that resolves to an array of objects
   */
  getContentGroup = (groupName, options, cacheResponse = true) => {
    // Convert group name from friendly URL to camelCase
    let group = camelCase(groupName)
    return new Promise(async resolve => {
      // Return cached group if present
      if (this.cache[group]) return resolve(this.cache[group])
      const contentData = await this.flamelinkApp.content.get(group, options)
      let content = this.arrayFromFirebaseData(contentData)
      // Get this group's main menu item
      let mainMenu = await this.mainMenuItems()
      let mainMenuItem = mainMenu.find(
        item => item.url.replace('/', '') === groupName
      )
      if (mainMenuItem) {
        // Check if main menu has submenus
        if (mainMenuItem.subItems) {
          // The submenus point to detail pages, get the corresponding detailPages
          const detailPages = await this.getDetailPages()
          // Loop through submenus and search for detailPages
          mainMenuItem.subItems.forEach(subItem => {
            // Detail pages are nested this deep:
            if (subItem.subItems) {
              // Slugs we need to get from detailPages
              let slugsToGet = subItem.subItems.map(s => {
                return getSlug(s.title, { lang: 'sv' })
              })
              // Extract the titles
              detailPages.forEach(detailPage => {
                let contentItemToPopulate = content.find(
                  c => c.slug === getSlug(subItem.title, { lang: 'sv' })
                )
                if (contentItemToPopulate === undefined) {
                  console.warn("Could not find detailPage for", subItem.title)
                } else {
                  if (contentItemToPopulate.subContent === undefined) contentItemToPopulate.subContent = []
                  if (slugsToGet.includes(detailPage.slug)) {
                    contentItemToPopulate.subContent.push(detailPage)
                  }
                }
              })
            }
          })
        }
      }
      if (cacheResponse) {
        this.cache[group] = content
      }
      console.log(`[${group}] CMS Cache\n`, this.cache)
      return resolve(content)
    })
  }

  /**
   * Return a single content object
   * @param {string} groupName - A string representing a group, e.g. 'kurser'
   * @param {string} slug - A string representing a slug, e.g. 'konstkurs-VT-18'
   * @returns - A Promise that resolves to a content object
   */
  getContent = (groupName, slug) => {
    // Convert group name from friendly URL to camelCase
    let group = camelCase(groupName)
    return new Promise(async (resolve, reject) => {
      if (!this.cache[group]) {
        await this.getContentGroup(groupName)
      }
      // Return cached group if present
      if (this.cache[group]) {
        let cachedItem = this.cache[group].find(item => item.slug === slug)
        if (cachedItem) return resolve(cachedItem)
      }
      try {
        let id = this.idFromSlug(group, slug)
        if (!id) {
          await this.getContentGroup(group, { fields: ['id', 'name'] })
          id = this.idFromSlug(group, slug)
          if (!id) reject(`Kunde inte hitta /${group}/${slug}`)
        }
        // Get data from flamelink
        const content = await this.flamelinkApp.content.get(group, id)
        return resolve(content)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * Fetch Main Pages from CMS
   * 
   * @returns {array} - Returns an array of Main Page objects
   */
  getMainPages = () => {
    return new Promise(async (resolve, reject) => {
      if (this.cache.mainPages) return resolve(this.cache.mainPages)
      try {
        let mainPagesData = await this.flamelinkApp.content.get('mainPages')
        let mainPages = this.arrayFromFirebaseData(mainPagesData)
        // Cache main pages
        this.cache.mainPages = mainPages
        return resolve(mainPages)
      } catch(error) {
        return reject(error)
      }
    })
  }

  getPageContent = (pageName) => {
    // Convert page name from friendly URL to camelCase
    let page = camelCase(pageName)
    return new Promise(async (resolve, reject) => {
      if (this.cache[page]) return resolve(this.cache[page])
      let content = {}
      let mainPages = await this.getMainPages()
      let mainPage = mainPages.find(mainPage => {
        return mainPage.slug === pageName
      })
      // Extract props we don't need to return
      if (mainPage) {
        let { __meta__, subPages, ...neededProps } = mainPage
        content = { ...neededProps }
        if (mainPage.subPages) {
          // Fetch subPages
          let subPages = await this.flamelinkApp.content.get('subPages', {
            fields: [
              'id', 'name', 'detailPages'
            ],
            populate: [
              {
                field: 'detailPages',
                subFields: ['detailPage']
              }
            ]
          })
          content.subPages = this.arrayFromFirebaseData(subPages)
        }
      }
      this.cache[page] = content
      return resolve(content)
    })
  }

  /**
   * Populate passed in content object with any existing subPages content
   */
  // populateSubPages = async content => {
  //   return new Promise(async resolve => {
  //     let subPagesSlugs = []
  //     content.subPages.forEach(subPage => {
  //       subPagesSlugs.push(getSlug(subPage.name, { lang: 'sv' }))
  //     })
  //     // Fetch detailPages
  //     const detailPagesData = await this.flamelinkApp.content.get(
  //       ContentGroup.DETAIL_PAGES
  //     )
  //     // Convert result to array
  //     const detailPages = this.arrayFromFirebaseData(detailPagesData)
  //     // Add relevant pages to content.subContent
  //     const subContent = detailPages.filter(detailPage =>
  //       subPagesSlugs.includes(detailPage.slug)
  //     )
  //     content.subContent = subContent
  //     resolve()
  //   })
  // }

  getURL = id => {
    return this.flamelinkApp.storage.getURL(id, { size: 'device' })
  }

  /**
   * Fetch images for the start page carousel
   * @returns - A Promise that resolves to an array of objects, e.g.
   * {
   *   title: 'Image Headline',
   *   alt: 'Image caption text',
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
        console.warn("Didn't find a slug - creating one from", result.name)
        result.slug = getSlug(result.name, { lang: 'sv' })
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
