const enums = {};

/** @enum {string} */
enums.genderType = {
  'feminine': 'feminine',
  'masculine': 'masculine',
  'neuter': 'neuter'
};

/**
 * @enum {string}
 * @see {@link https://docs.citationstyles.org/en/master/specification.html#name-variables}
 */
enums.personType = {
  /** author */
  'author': 'author',
  /** editor of the collection holding the item (e.g. the series editor for a book) */
  'collection-editor': 'collection-editor',
  /** composer (e.g. of a musical score) */
  'composer': 'composer',
  /** author of the container holding the item (e.g. the book author for a book chapter) */
  'container-author': 'container-author',
  /** director (e.g. of a film) */
  'director': 'director',
  /** editor */
  'editor': 'editor',
  /** managing editor (“Directeur de la Publication” in French) */
  'editorial-director': 'editorial-director',
  /** illustrator (e.g. of a children’s book) */
  'illustrator': 'illustrator',
  /** interviewer (e.g. of an interview) */
  'interviewer': 'interviewer',
  /** ? */
  'original-author': 'original-author',
  /** recipient (e.g. of a letter) */
  'recipient': 'recipient',
  /** author of the item reviewed by the current item */
  'reviewed-author': 'reviewed-author',
  /** translator */
  'translator': 'translator',
};
