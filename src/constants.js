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

export const ContentGroup = {
  COURSES: 'kurser',
  PRAKTISK_INFO: 'praktiskInfo',
  START_PAGE_SLIDES: 'startPageSlides',
  DETAIL_PAGES: 'detailPages'
}
