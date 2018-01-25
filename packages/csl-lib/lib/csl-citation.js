function citation (refs, locales) {
  if (typeof locales === 'undefined') {
    throw new Error('no locales');
  }
  return 'this is a citation';
};

module.exports = citation;
