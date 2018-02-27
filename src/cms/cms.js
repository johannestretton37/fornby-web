import getSlug from 'speakingurl'
import firebaseApp from '../config/firebase.app'
import flamelink from 'flamelink'
import sanitizeHtml from 'sanitize-html-react'
import CustomError from '../models/CustomError'
import { ContentGroup, PageSlug, defaultFields, htmlFields, searchableFields, sanitizeSettings } from '../constants'
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
    this.pending = {}
    this.searchIndex = []
    this.searchInited = false
    this.selectedCity = undefined
    // this.getBasicInfo()
  }

  /**
   * Get basic info, such as navigation, page headlines and such
   */
  getBasicInfo = () => {
    return Promise.all([this.mainMenuItems(), this.getSlides(), this.getCourses()])
  }

  /**
   * Helper function to create a main menu item
   * @param {object} item - object fetched from flamelink mainNavigation collection
   * @returns {object} - A main menu item object
   */
  createMainMenuItem = (item) => {
    let { id, title, url, cssClass, order } = item
    let separator = url.indexOf('#') !== -1 ? '#' : '/'
    let slug = separator + getSlug(title, { lang: 'sv' })
    if (title === 'Start') slug = '/'
    const mainMenuItem = {
      id,
      title,
      url,
      slug,
      cssClass,
      order,
      children: []
    }
    return mainMenuItem
  }

  /**
   * Main Menu
   */
  mainMenuItems = () => {
    // Return cached content if present
    if (this.cache.mainMenu) return Promise.resolve(this.cache.mainMenu)
    // Check if promise is pending
    if (this.pending.mainMenu) return this.pending.mainMenu
    // Cache pending promise to prevent multiple calls to cms
    this.pending.mainMenu = new Promise(async (resolve, reject) => {
      try {
        const mainNavigation = await this.flamelinkApp.nav.get('mainNavigation', {
          fields: ['items']
        })
        if (!mainNavigation) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Navigation')
        if (!mainNavigation.items) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Navigation items')
        // Structure menu
        // This is all the root links, e.g. '/kurser'
        let rootLinks = mainNavigation.items.filter(item => item.parentIndex === 0)
        // Convert root links to mainMenuItems
        let mainMenu = rootLinks.map(item => this.createMainMenuItem(item))
        // Populate root links with children
        mainNavigation.items.forEach(item => {
          item.contentGroup = ContentGroup.MAIN_MENU_ITEMS
          if (item.parentIndex > 0) {
            // This is a sub link, e.g. '/kurser/musikkurs'
            let parent = mainMenu.find(rootItem => rootItem.id === item.parentIndex)
            if (parent) {
              item.url = parent.url + item.url
              parent.children.push(item)
            }
          }
          // Index for search
          this.indexForSearch(item, ['title'])
        })
        this.cache.mainMenu = mainMenu
        return resolve(mainMenu)
      } catch (error) {
        return reject(error)
      }
    })
    return this.pending.mainMenu
  }

  getCourseCategories = () => {
    // Return cached content if present
    if (this.cache.courseCategories) return Promise.resolve(this.cache.courseCategories)
    // Check if promise is pending
    if (this.pending.courseCategories) return this.pending.courseCategories
    // Cache pending promise to prevent multiple calls to cms
    this.pending.courseCategories = new Promise(async (resolve, reject) => {
      try {
        const options = { populate: ['images'] };
        const courseCategories = await this.flamelinkApp.content.get(ContentGroup.COURSE_CATEGORIES, options)
        if (!courseCategories) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta några kurskategorier. Försök igen senare', true)
        this.cache.courseCategories = courseCategories
        return resolve(courseCategories)
      } catch (error) {
        return reject(error)
      }
    })
    return this.pending.courseCategories
  }

  /**
   * Fetch all courses from flamelink
   * @returns {Promise<[{}]} - A Promise that resolves to an array of course objects
   */
  getCourses = () => {
    // Return cached content if present
    if (this.cache.courses) return Promise.resolve(this.cache.courses)
    // Check if promise is pending
    if (this.pending.courses) return this.pending.courses
    // Cache pending promise to prevent multiple calls to cms
    this.pending.courses = new Promise(async (resolve, reject) => {
      try {
        const options = {
          populate: ['images', 'courseContactStaff']
        };
        const coursesData = await this.flamelinkApp.content.get(ContentGroup.COURSES, options)
        if (!coursesData) throw new CustomError('Här var det tomt.', 'Vi kunde inte hitta några kurser för de valda alternativen.', true, '/kurser', 'Klicka här för att se alla våra kurser.')
        const courses = this.arrayFromFirebaseData(coursesData, ContentGroup.COURSES)
        const staffPages = await this.getStaffPages()
        courses.forEach((course, i) => {
          courses[i].staff = []
          if (course.courseContactStaff) {
            course.courseContactStaff.forEach(person => {
              courses[i].staff.push(staffPages[person.id])
            })
          }
        })
        this.cache.courses = courses;
        return resolve(courses);
      } catch (error) {
        console.error('getCourses()')
        return reject(error)
      }
    })
    return this.pending.courses
  }

  /**
   * Return an array of content objects
   *
   * @param {string} groupName - The name of the group to get. Example `ContentGroup.COURSES` ('kurser')
   * @param {object} options - The property fields to get. Example `{ fields: ['id', 'name', 'shortInfo'] }`
   * @returns - A Promise that resolves to an array of objects
   */
  getContentGroup = (groupName, options = {}) => {
    console.log('getContentGroup ' + groupName + ',', options);
    // Convert group name from friendly URL to camelCase
    let group = camelCase(groupName)
    // Return cached content if present
    if (this.cache[group]) return Promise.resolve(this.cache[group])
    // Check if promise is pending
    if (this.pending[group]) return this.pending[group]
    // Cache pending promise to prevent multiple calls to cms
    this.pending[group] = new Promise(async (resolve, reject) => {
      try {
        const contentData = await this.flamelinkApp.content.get(group, options)
        if (!contentData) throw new Error(`Could not find content group: ${groupName}`)
        let content = this.arrayFromFirebaseData(contentData, groupName)
        this.cache[group] = content
        console.log(`[${group}] CMS Cache\n`, this.cache)
        return resolve(content)
      } catch (error) {
        return reject(error)
      }
    })
    return this.pending[group]
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
    // Return cached content if present
    if (this.cache.mainPages) return Promise.resolve(this.cache.mainPages)
    // Check if promise is pending
    if (this.pending.mainPages) return this.pending.mainPages
    // Cache pending promise to prevent multiple calls to cms
    this.pending.mainPages = new Promise(async (resolve, reject) => {
      try {
        let mainPagesData = await this.flamelinkApp.content.get(ContentGroup.MAIN_PAGES, {
          populate: ['images']
        })
        if (!mainPagesData) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Main Pages')
        let mainPages = this.arrayFromFirebaseData(mainPagesData, ContentGroup.MAIN_PAGES)
        // Cache main pages
        this.cache.mainPages = mainPages
        console.log('getMainPages() cached:', this.cache)
        return resolve(mainPages)
      } catch (error) {
        return reject(error)
      }
    })
    return this.pending.mainPages
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
    // Return cached content if present
    if (this.cache.staffPages) return Promise.resolve(this.cache.staffPages)
    // Check if promise is pending
    if (this.pending.staffPages) return this.pending.staffPages
    // Cache pending promise to prevent multiple calls to cms
    this.pending.staffPages = new Promise(async (resolve, reject) => {
      // If staffPages is cached, return cache
      try {
        const staffPages = await this.flamelinkApp.content.get(ContentGroup.STAFF, {
          // fields: ['name', 'phone', 'email', 'images', 'role', 'slug'],
          populate: ['images']
        })
        if (!staffPages) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta Staff Pages')
        // Index for search
        Object.values(staffPages).forEach(staffPage => {
          staffPage.contentGroup = ContentGroup.STAFF
          this.indexForSearch(staffPage, ['name', 'role', 'phone', 'summary'])
        })
        // Cache staffPages
        this.cache.staffPages = staffPages
        console.log('getStaffPages() cached:', this.cache)
        return resolve(staffPages)
      } catch (error) {
        return reject(error)
      }
    })
    return this.pending.staffPages
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
    // Return cached content if present
    if (this.cache[page]) return Promise.resolve(this.cache[page])
    // Check if promise is pending
    if (this.pending[page]) return this.pending[page]
    // Cache pending promise to prevent multiple calls to cms
    this.pending[page] = new Promise(async (resolve, reject) => {
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
          let { __meta__, subPages, showCourses, ...neededProps } = mainPage
          // Add the rest to our content object
          content = { ...neededProps }
          // Check if page should display CoursesPage or not
          if (showCourses === true) {
            // Let's display all courses that applies to this page
            const allCourses = await this.getCourses()
            const allCategories = await this.getCourseCategories()
            // Temp container for unspecified courses
            let otherCourses = new Set()
            // Init array to hold categories
            content.courseCategories = []
            // Loop all categories
            Object.values(allCategories).forEach(category => {
              category.url = '/kurser/' + category.slug
              // Extract courses that should be in this category
              let courses = allCourses.filter(course => {
                // If courseCategory is undefined, default to `övriga kurser`
                if (!course.courseCategory) {
                  otherCourses.add(course)
                  return false
                }
                if (course.courseCategory.includes(category.id)) {
                  course.url = category.url + '/' + course.slug
                  return true
                }
                return false
              })
              if (courses.length > 0) {
                // Add courses to categories array
                content.courseCategories.push({
                  courses,
                  ...category
                })
              }
            })
            // Lastly, add otherCourses
            if (otherCourses.size > 0) {
              let otherCoursesCategory = {
                id: 1337,
                name: 'Övriga kurser',
                isEditing: false,
                isPublished: true,
                slug: 'ovriga-kurser',
                shortInfo: 'Beskrivning här...',
                courses: Array.from(otherCourses.values())
              }
              content.courseCategories.push(otherCoursesCategory)
              this.indexForSearch(otherCoursesCategory, ['name', 'shortInfo'])
            }
          }
          // If the mainPage has subPages
          if (mainPage.subPages) {
            /**
             * `subPages` is an array of objects.
             * Each object has a `subPage` array
             * 
             * Since flamelink doesn't allow us to query which subPages we want,
             * we need to fetch all subPages and cache them
             * 
             * NOTE: - We need to specify every field we want to get!
             */
            const subPageIds = mainPage.subPages.map(item => {
              return item.subPage
            })
            if (this.cache.subPages) {
              content.subPages = this.cache.subPages.filter(subPage => subPageIds.includes(subPage.id))
            } else {
              let subPages = await this.flamelinkApp.content.get(ContentGroup.SUB_PAGES, {
                fields: [
                  'showByDefault', ...defaultFields, ContentGroup.DETAIL_PAGES, ContentGroup.STAFF
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
                const allSubPages = this.arrayFromFirebaseData(subPages, ContentGroup.SUB_PAGES)
                // Index detailPages for search
                allSubPages.forEach(subPage => {
                  // Find subPage's mainPage
                  let subPageParent = this.cache.mainPages.find(mainPage => {
                    if (!mainPage.subPages) return false
                    return mainPage.subPages.find(mainPageSubPage => {
                      return subPage.id === mainPageSubPage.subPage
                    })
                  })
                  if (subPageParent) {
                    subPage.parentUrl = '/' + subPageParent.slug
                  } else {
                    subPage.parentUrl = '/error'
                  }
                  if (subPage.detailPages) {
                    subPage.detailPages.forEach(detailPage => {
                      detailPage.detailPage.forEach(page => {
                        page.contentGroup = ContentGroup.DETAIL_PAGES
                        page.parentUrl = subPage.parentUrl + '/' + subPage.slug
                        this.indexForSearch(page, searchableFields)
                      })
                    })
                  }
                })
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
    return this.pending[page]
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
    throw new Error('Hämta main pages images istället så struntar vi i START_PAGE_SLIDES')
    
    // Return cached content if present
    if (this.cache[ContentGroup.START_PAGE_SLIDES]) return Promise.resolve(this.cache[ContentGroup.START_PAGE_SLIDES])
    // Check if promise is pending
    if (this.pending[ContentGroup.START_PAGE_SLIDES]) return this.pending[ContentGroup.START_PAGE_SLIDES]
    // Cache pending promise to prevent multiple calls to cms
    this.pending[ContentGroup.START_PAGE_SLIDES] = new Promise(async (resolve, reject) => {
      try {
        const slides = await this.getContentGroup(
          ContentGroup.START_PAGE_SLIDES,
          {
            fields: ['title', 'alt', 'subtitle', ...defaultFields],
            populate: ['images']
          }
        )
        if (!slides) throw new CustomError('Ett fel uppstod', 'Kunde inte hitta slides')
        this.cache[ContentGroup.START_PAGE_SLIDES] = slides
        return resolve(slides)
      } catch (error) {
        return reject(error)
      }
    })
    return this.pending[ContentGroup.START_PAGE_SLIDES]
  }

  /**
   * Helper function to transform a firebase object into an array
   * @param {object} data - The data returned from a flamelink operation, such as `get`
   * @param {string} contentGroup - A string corresponding to a flamelink Collection
   * @returns - An array of objects
   */
  arrayFromFirebaseData = (data, contentGroup) => {
    let array = []
    if (!data) return array
    Object.values(data).forEach(value => {
      if (this.isProd && !value.isPublished) {
        // Don't show unpublished content
        console.log('Don\'t show unpublished content', value)
        return;
      }
      let result = {
        contentGroup
      }
      // Check if data is in edit mode
      let dataObject = this.checkEditMode(value)
      Object.entries(dataObject).forEach(([field, val]) => {
        if (htmlFields.includes(field)) {
          // This field may contain html - sanitize it
          result[field] = sanitizeHtml(val, sanitizeSettings)
        } else {
          result[field] = val
        }
      })
      if (result.slug === undefined && result.name !== undefined) {
        console.warn("Didn't find a slug - creating one from", result.name)
        result.slug = getSlug(result.name, { lang: 'sv' })
      }
      // Index value for searches
      this.indexForSearch(result, searchableFields)
      array.push(result)
    })
    return array
  }

  /**
   * Store an object in searchIndex for easy access
   * @param {object} content - the content object to store
   * @param {array} fields - an array of strings, corresponding to the fields
   * that should be searchable
   */
  indexForSearch = (content, fields) => {
    fields.forEach(field => {
      const value = content[field]
      if (value) {
        this.searchIndex.push({
          text: value.toLowerCase(),
          field,
          content
        })
      }
    })
  }
  
  checkEditMode = value => {
    let dataObject = value
    if (value.isEditing) {
      // If this is prod, show stored values
      if (this.isProd) {
        // Show stored values
        dataObject = value._prodContent
        if (!dataObject) {
          console.error('Found no _prodContent for data in edit mode.', value)
        }
      }
    }
    return dataObject
  }

  getURL = (id, size) => {
    // Return cached content if present
    if (this.cache.imageUrls[id]) return Promise.resolve(this.cache.imageUrls[id])
    // Check if promise is pending
    if (this.pending.imageUrls[id]) return this.pending.imageUrls[id]
    // Cache pending promise to prevent multiple calls to cms
    this.pending.imageUrls[id] = new Promise(async (resolve, reject) => {
      try {
        const url = await this.flamelinkApp.storage.getURL(id, { size: size || 'device' })
        if (!url) throw new CustomError('Ett fel uppstod', `No URL found for ${id}`)
        this.cache.imageUrls[id] = url
        return resolve(url)
      } catch (error) {
        return reject(`No URL found for ${id}`)
      }
    })
    return this.pending.imageUrls[id]
  }

  idFromSlug = (group, slug) => {
    if (!this.cache[group]) return undefined
    let ids = this.cache[group].filter(member => {
      return member.slug === slug
    })
    return ids.length > 0 ? ids[0].id : undefined
  }

  /**
   * Search
   */
  search = searchInputValue => {
    if (!searchInputValue) return []
    if (!this.searchInited) {
      // Search firebase
      // Only do this once
      this.searchInited = true
      // Check for content groups that has not been cached yet
      Object.values(ContentGroup).forEach(group => {
        if (this.cache[group] === undefined && this.pending[group] === undefined) {
          // Search content that we have not cached yet
          switch (group) {
            case ContentGroup.COURSES:
              // Kurser is not cached, fetch courses, courseCategories.
              // This will also cache staffPages
              Promise.all([
                this.getCourseCategories(),
                this.getCourses()
              ])
            break
            case ContentGroup.SUB_PAGES:
              // Fetch Sub pages
              Promise.all([
                this.getPageContent(PageSlug.PRAKTISK_INFO)
              ])
          }
        }
      })
    }
    this.searchTerm = searchInputValue.toLowerCase()
    let results = this.searchIndex.filter(this.stringMatch)
    if (this.searchTerm !== '') {
      results = results.map(result => {
        let heading = this.highlightedSearchResult(result.content.name || result.content.title, this.searchTerm)
        let paragraph = this.highlightedSearchResult(result.content[result.field], this.searchTerm)
        return {
          heading,
          paragraph,
          url: this.baseUrlFor(result.content) + (result.content.slug || ''),
          field: result.field
        }
      })
    }
    // Sort results according to match priority
    return results.sort((resultA, resultB) => {
      if (resultA.field === resultB.field) return 0
      if (resultA.field === 'name') return -1
      if (resultA.field === 'shortInfo' && resultB.field === 'body') return -1
      if (resultA.field === 'body') return 1
      return 1
    })
  }

  highlightedSearchResult = (text, searchTerm) => {
    if (!searchTerm) return text
    if (!text) return undefined
    // Remove html tags
    const textOnly = sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: []
    })
    // Split text at match positions
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    let parts = textOnly.split(regex)
    // Limit the search result to `maxCharacters` characters
    const maxCharacters = 200
    const charsBeforeFirstMatch = 20
    if (parts[0].toLowerCase() !== searchTerm && parts[0].length > charsBeforeFirstMatch) {
      // Limit the text before the first match to approx. `charsBeforeFirstMatch` characters
      // We don't want to break up words, so find the nearest space character
      let firstWordBreak = parts[0].indexOf(' ', charsBeforeFirstMatch)
      if (firstWordBreak > -1) {
        parts[0] = '...' + parts[0].substr(firstWordBreak)
      }
    }
    let highlighted = parts.map(part => {
      if (part.toLowerCase() === searchTerm) return `<span class="highlighted">${part}</span>`
      return part
    }).join('')
    if (highlighted.length > maxCharacters) {
      // Limit the text to approx. `maxCharacters` characters
      // We still don't want to break up words, so find the nearest space character
      let lastWordBreak = highlighted.indexOf(' ', maxCharacters)
      if (lastWordBreak > -1) {
        highlighted = highlighted.substr(0, lastWordBreak) + ' ...'
      } else {
        highlighted = highlighted.substr(0, maxCharacters) + ' ...'
      }
    }
    return highlighted
  }

  stringMatch = libraryItem => {
    return libraryItem.text.indexOf(this.searchTerm) !== -1
  }

  baseUrlFor = content => {
    let baseUrl = '/', categoryId, categorySlug
    switch (content.contentGroup) {
      case ContentGroup.COURSES:
        if (content.courseCategory) {
          categoryId = content.courseCategory[0]
          categorySlug = this.cache.courseCategories[categoryId].slug
          return '/kurser/' + categorySlug + '/'
        } else {
          // Course has no category
          return '/kurser/ovriga-kurser/'
        }
      case ContentGroup.STAFF:
        return '/om-fornby/personal#'
      case ContentGroup.SUB_PAGES:
        return content.parentUrl + '/'
      case ContentGroup.DETAIL_PAGES:
        return content.parentUrl + '#'
      case ContentGroup.MAIN_MENU_ITEMS:
        return content.url
      default:
        console.warn('No baseUrl defined for', content.contentGroup)
      break
    }
    return baseUrl
  }
}

const cms = new CMS()
if (!this.isProd) window.cms = cms
export default cms
