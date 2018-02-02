import CoursePage from './components/CoursePage'
import DefaultPage from './components/DefaultPage'
import ApplyPage from './components/ApplyPage'

/**
 * Map react components to content groups
 * 
 * Use this constant to decide what kind of page should be
 * rendered.
 * 
 * The key is a camelCased version of the friendly url,
 * the value is a React component.
 */
export const pageTypes = {
  kurser: CoursePage,
  praktiskInfo: DefaultPage,
  ansok: ApplyPage,
}

/**
 * Map constants to Flamelink collection names
 */
export const ContentGroup = {
  MAIN_PAGES: 'mainPages',
  SUB_PAGES: 'subPages',
  DETAIL_PAGES: 'detailPages',
  START_PAGE_SLIDES: 'startPageSlides',
  COURSES: 'kurser',
}

/**
 * Map slugs
 */
export const PageSlug = {
  COURSES: 'kurser',
  PRAKTISK_INFO: 'praktisk-info',
  ANSOK: 'ansok',
  KONFERENS: 'konferens',
  OM_FORNBY: 'om-fornby',
}
