import getSlug from 'speakingurl'
import firebaseApp from '../config/firebase.app'
import flamelink from 'flamelink'
import CustomError from '../models/CustomError'
import { ContentGroup } from '../constants'
import { camelCase } from '../Helpers'

/**
 * CMS
 * This is an API for easy access to the Flamelink Content Managing System.
 */

class CMS {
  constructor() {
    this.isProd = process.env.REACT_APP_DATABASE === 'production'
    this.flamelinkApp = flamelink({ firebaseApp })
    this.cache = {
      imageUrls: {}
    }
    // this.getBasicInfo()
  }

  /**
   * Get basic info, such as navigation, page headlines and such
   */
  getBasicInfo = () => {
    return Promise.all([this.mainMenuItems(), this.getSlides(), this.getCourses()])
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
    return new Promise(async (resolve, reject) => {
      // Return cached main menu if present
      if (this.cache.mainMenu) return resolve(this.cache.mainMenu)
      try {
        const mainNavigation = await this.flamelinkApp.nav.get('mainNavigation', {
          fields: ['items']
        })
        if (!mainNavigation) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Navigation')
        if (!mainNavigation.items) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Navigation items')
        // Structure menu
        let mainMenu = []
        mainNavigation.items.forEach(item => {
          if (item.parentIndex === 0) {
            // This is a root link, e.g. '/kurser'
            mainMenu.push(this.createMainMenuItem(item))
          } else {
            /* Get this from MainPages instead */
            // This is a sub link, e.g. '/kurser/mer-info'
            // Find parent and add child to parent's subItems array
            // We can assume that the parent is already added to mainMenu,
            // search from end of array
            // const array = mainMenu
            // let parent = this.findParentFor(item, array)
            // if (parent) {
            //   if (!parent.subItems) parent.subItems = []
            //   parent.subItems.push(this.createMainMenuItem(item, parent))
            // }
          }
        })
        this.cache.mainMenu = mainMenu
        return resolve(mainMenu)
      } catch (error) {
        return reject(error)
      }
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
  DEPRECATED_findParentFor = (item, array) => {
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

  DEPRECATED_getDetailPages = () => {
    return new Promise(async (resolve, reject) => {
      // Return cached data if it exists
      if (this.cache.detailPages) return resolve(this.cache.detailPages)
      // No cache, fetch detailPages
      try {
        const detailPagesData = await this.flamelinkApp.content.get(
          ContentGroup.DETAIL_PAGES + 'xxx'
        )
        // Convert result to array
        const detailPages = this.arrayFromFirebaseData(detailPagesData)
        this.cache.detailPages = detailPages
        return resolve(detailPages)
      } catch (error) {
        return reject(error)
      }
    })
  }

  getCourses = () => {
    return new Promise(async resolve => {

      if (this.cache.courseMainPage) return resolve(this.cache.courseMainPage)
      const coursePageContent = await this.flamelinkApp.content.get(ContentGroup.COURSES_MAIN_PAGE, 1518008977981);
      if (!coursePageContent) return resolve(null);
      const options = { populate: ['courses'] };
      const courseCategories = this.arrayFromFirebaseData(await this.flamelinkApp.content.get(ContentGroup.COURSES_CATEGORIES, options));

      for (let i = 0; i < coursePageContent.courseCategory.length; i++) {
        let courseCategory = courseCategories.find(c => c.id === coursePageContent.courseCategory[i]);
        if (courseCategory) {
          coursePageContent.courseCategory[i] = courseCategory;
        }
      }
      this.cache.courseMainPage = coursePageContent;
      return resolve(coursePageContent);
    })
  }

  /**
   * Return an array of content objects
   *
   * @param {string} groupName - The name of the group to get. Example `ContentGroup.COURSES` ('kurser')
   * @param {object} options - The property fields to get. Example `{ fields: ['id', 'name', 'shortInfo'] }`
   * @returns - A Promise that resolves to an array of objects
   */
  getContentGroup = (groupName, options = {}) => {
    console.log('getContentGroup ' + groupName);
    // Convert group name from friendly URL to camelCase
    let group = camelCase(groupName)
    // Return cached group if present
    return new Promise(async (resolve, reject) => {
      if (this.cache[group]) return resolve(this.cache[group])
      try {
        const contentData = await this.flamelinkApp.content.get(group, options)
        if (!contentData) throw new Error(`Could not find content group: ${groupName}`)
        let content = this.arrayFromFirebaseData(contentData)
        console.log('Got content');
        console.log(content);
        this.cache[group] = content
        console.log(`[${group}] CMS Cache\n`, this.cache)
        return resolve(content)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * Return a single content object
   * @param {string} groupName - A string representing a group, e.g. 'kurser'
   * @param {string} slug - A string representing a slug, e.g. 'konstkurs-VT-18'
   * @returns - A Promise that resolves to a content object
   */
  DEPRECATED_getContent = (groupName, slug) => {
    console.log('WOW!!! hämtar ' + groupName);
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
   * Use this method to get an array of main page objects. Each object
   * will correspond to a collection item fetched from flamelink.
   * https://app.flamelink.io/edit/collection/mainPages
   * 
   * @returns {Promise} - Returns Promise that resolves to an array of Main Page objects
   */
  getMainPages = () => {
    return new Promise(async (resolve, reject) => {
      // If mainPages is cached, return cache
      if (this.cache.mainPages) return resolve(this.cache.mainPages)
      try {
        let mainPagesData = await this.flamelinkApp.content.get(ContentGroup.MAIN_PAGES)
        if (!mainPagesData) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Pages')
        let mainPages = this.arrayFromFirebaseData(mainPagesData)
        // Cache main pages
        this.cache.mainPages = mainPages
        console.log('getMainPages() cached:', this.cache)
        return resolve(mainPages)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * Fetch Staff info from CMS
   * 
   * Use this method to get an object of staff page objects. Each object
   * will correspond to a collection item fetched from flamelink.
   * https://app.flamelink.io/edit/collection/staff
   * 
   * @returns {Promise} - Returns Promise that resolves to an object of Staff objects
   */
  getStaffPages = () => {
    return new Promise(async (resolve, reject) => {
      // If staffPages is cached, return cache
      if (this.cache.staffPages) return resolve(this.cache.staffPages)
      try {
        const staffPages = await this.flamelinkApp.content.get(ContentGroup.STAFF, {
          // fields: ['name', 'phone', 'email', 'portrait', 'role', 'slug'],
          populate: ['portrait']
        })
        if (!staffPages) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Staff Pages')
        // Cache staffPages
        this.cache.staffPages = staffPages
        console.log('getStaffPages() cached:', this.cache)
        return resolve(staffPages)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * Fetch content from CMS
   * 
   * Use this method to get an array of objects corresponding to
   * a collection in flamelink
   * @param {string} pageName - The name of the pages to fetch. Can be camelCased or kebab-cased.
   * @returns {Promise} - A Promise that resolves to an array of objects on success
   */
  getPageContent = (pageName) => {
    // Convert page name from friendly URL to camelCase
    let page = camelCase(pageName)
    return new Promise(async (resolve, reject) => {
      // If page is cached, return cache
      if (this.cache[page]) return resolve(this.cache[page])
      try {
        let content = {}
        // Get array of main pages
        let mainPages = await this.getMainPages()
        if (!mainPages) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Pages found (in cms.getPageContent())')
        // Find the page we're looking for
        let mainPage = mainPages.find(mainPage => {
          return mainPage.slug === pageName
        })
        // Check if any main page matched
        if (mainPage) {
          // Extract props we don't need to return
          let { __meta__, subPages, ...neededProps } = mainPage
          // Add the rest to our content object
          content = { ...neededProps }
          // If the mainPage has subPages
          if (mainPage.subPages) {
            /** 
             * Since flamelink doesn't allow us to query which subPages we want,
             * we need to fetch all subPages and cache them
             * 
             * NOTE: - We need to specify every field we want to get!
             */
            const subPageIds = mainPage.subPages.map(item => item.subPage)
            if (this.cache.subPages) {
              content.subPages = this.cache.subPages.filter(subPage => subPageIds.includes(subPage.id))
            } else {
              let subPages = await this.flamelinkApp.content.get(ContentGroup.SUB_PAGES, {
                fields: [
                  'id', 'name', 'showByDefault', ContentGroup.DETAIL_PAGES, ContentGroup.STAFF
                ],
                populate: [
                  {
                    field: ContentGroup.DETAIL_PAGES,
                    subFields: ['detailPage']
                  }
                ]
              })
              if (subPages) {
                // Convert subPages to array
                const allSubPages = this.arrayFromFirebaseData(subPages)
                // Check for staffPages
                let staffPages = await this.getStaffPages()
                if (staffPages) {
                  // Populate subPages with staff
                  allSubPages.forEach(subPage => {
                    if (subPage.staff) {
                      subPage.staff = subPage.staff.map(staffObject => {
                        return staffPages[staffObject.staffPerson]
                      })
                    }
                  })
                }
                // Cache subPages
                this.cache.subPages = allSubPages
                // Add page's subPages to content object
                content.subPages = allSubPages.filter(subPage => subPageIds.includes(subPage.id))
              }
            }
          }
        }
        // Cache content
        this.cache[page] = content
        // Return content
        console.log('getPageContent(' + pageName + '), cached:', this.cache)
        return resolve(content)
      } catch (error) {
        return reject(error)
      }
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

  getURL = (id, size) => {
    return new Promise(async (resolve, reject) => {
      if (this.cache.imageUrls[id]) return resolve(this.cache.imageUrls[id])
      try {
        const url = await this.flamelinkApp.storage.getURL(id, { size: size || 'device' })
        if (!url) throw new CustomError('Ett fel uppstod', `No URL found for ${id}`)
        this.cache.imageUrls[id] = url
        return resolve(url)
      } catch (error) {
        return reject(`No URL found for ${id}`)
      }
    })
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
        if (!slides) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta slides')
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
      if (this.isProd && !value.isPublished) {
        // Don't show unpublished content
        return;
      }

      let result = {}
      // Check if data is in edit mode
      let dataObject = value
      if (value.isEditing) {
        // If this is prod, show stored values
        if (this.isProd) {
          // Show stored values
          dataObject = value._prodContent
          if (!dataObject) {
            debugger
          }
        }
      }

      Object.entries(dataObject).forEach(([field, val]) => {
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
