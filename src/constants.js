import CoursePage from './components/CoursePage'

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
}

/**
 * Map constants to Flamelink collection names
 */
export const ContentGroup = {
  MAIN_PAGES: 'mainPages',
  SUB_PAGES: 'subPages',
  DETAIL_PAGES: 'detailPages',
  STAFF: 'staff',
  START_PAGE_SLIDES: 'startPageSlides',
  START_PAGE_BANNERS: 'startPageBanners',
  COURSES_MAIN_PAGE:'coursesMainPage',
  COURSE_CATEGORIES: 'courseCategories',
  COURSES: 'courses',
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

/**
 * Define fields that we'll always fetch from flamelink
 */
export const defaultFields = [
  'id',
  'name',
  'slug',
  'images',
  'isPublished',
  'isEditing',
]