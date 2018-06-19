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
  kurser: CoursePage
}

/**
 * Map constants to Flamelink collection names
 */
export const ContentGroup = {
  MAIN_NAVIGATION: 'mainNavigation',
  MAIN_PAGES: 'mainPages',
  SUB_PAGES: 'subPages',
  DETAIL_PAGES: 'detailPages',
  STAFF: 'staff',
  STAFF_PAGES: 'staffPages',
  START_PAGE_SLIDES: 'startPageSlides',
  START_PAGE_BANNERS: 'startPageBanners',
  COURSE_CATEGORIES: 'courseCategories',
  COURSES: 'courses',
  MAIN_MENU_ITEMS: 'MAIN_MENU_ITEMS'
}

/**
 * Map constants to Flamelink column names
 */
export const ColumnName = {
  ITEMS: 'items',
  TITLE: 'title',
  NAME: 'name',
  BODY: 'body',
  SHORT_INFO: 'shortInfo',
  IMAGES: 'images',
  ROLE: 'role',
  PHONE: 'phone',
  SUMMARY: 'summary',
  COURSE_CONTACT_STAFF: 'courseContactStaff'
}

/**
 * Map slugs
 */
export const PageSlug = {
  COURSES: 'kurser',
  PRAKTISK_INFO: 'praktisk-info',
  ANSOK: 'ansok',
  KONFERENS: 'konferens',
  OM_FORNBY: 'om-fornby'
}

/**
 * Define fields that we'll always fetch from flamelink
 */
export const defaultFields = [
  'id',
  'name',
  'body',
  'slug',
  'images',
  'previews',
  'isPublished',
  'isEditing'
]

/**
 * Defined fields that may contain html that needs to be sanitized
 */
export const htmlFields = ['body', 'summary', 'mainBody']

export const searchableFields = ['name', 'shortInfo', 'body']

/**
 * Define cities
 */
export const cities = [
  {
    title: 'Borlänge',
    slug: 'borlange',
    url: '/'
  },
  {
    title: 'Falun',
    slug: 'falun',
    url: '/falun'
  },
  {
    title: 'Ludvika',
    slug: 'ludvika',
    url: '/ludvika'
  }
]

/**
 * Sanitize html settings
 */
export const sanitizeSettings = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'sub',
    'sup',
    'ins',
    'del'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    // We don't currently allow img itself by default, but this
    // would make sense if we did
    img: ['src']
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [
    'img',
    'br',
    'hr',
    'area',
    'base',
    'basefont',
    'input',
    'link',
    'meta'
  ],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  allowedSchemesByTag: {}
}

/**
 * Brand colors
 */
export const Colors = {
  primary: '#ac285c',
  secondary: '#4f6791'
}
