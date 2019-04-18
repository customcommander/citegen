/**
 * @typedef {object} StyleOptions
 * @property {string} `limit-day-ordinals-to-day-1`
 * @property {string} `punctuation-in-quote`
 */

/**
 * @typedef {object} DatePart
 * @property {string} `form`
 * @property {string} `name`
 * @property {?string} `prefix`
 * @property {?string} `suffix`
 */

/**
 * @typedef {object} Term
 * @property {string} `name`
 * @property {string} `form`
 * @property {enums.genderType} `gender`
 * @property {enums.genderType} `gender-form`
 * @property {string[]} `value`
 */

 /**
 * @typedef {object} Locale
 * @property {StyleOptions} `style_options`
 * @property {DatePart[]} `date_text`
 * @property {DatePart[]} `date_numeric`
 * @property {Term[]} `terms`
 */