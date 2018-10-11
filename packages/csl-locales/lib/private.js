/*
 * PRIVATE MODULE
 *    PRIVATE MODULE
 *      PRIVATE MODULE
 *        PRIVATE MODULE
 *          PRIVATE MODULE
 *            PRIVATE MODULE
 *              PRIVATE MODULE !!!!
 *            PRIVATE MODULE
 *          PRIVATE MODULE
 *        PRIVATE MODULE
 *      PRIVATE MODULE
 *    PRIVATE MODULE
 * PRIVATE MODULE
 *
 * Implements http://docs.citationstyles.org/en/1.0.1/specification.html#locale-fallback
 *
 * Language codes come from the `xml:lang` attribute which can be set on <locale> elements.
 * Cf. http://docs.citationstyles.org/en/1.0.1/specification.html#locale-files-structure
 *
 * The type of the `xml:lang` attribute is `xsd:language` which implements RFC-1766.
 * Cf. http://books.xmlschemata.org/relaxng/ch19-77191.html
 * Cf. https://www.ietf.org/rfc/rfc1766.txt
 *
 * The following notes describes my current understanding of a language code
 * as described in RFC-1766.
 *
 * -  A language code is case insensitive.
 *    There exist naming conventions but these should not be enforced.
 *
 * -  A language code is made of one or several tags separated by an hyphen.
 *    Each tag is made of 1 to 8 ASCII alphabetic characters e.g., 'abc', 'abc-def', etc.
 *
 * -  The first tag however is limited to:
 *    •   A two-letter tag: a ISO 639 language e.g., 'en'.
 *    •   The letter 'i': a IANA-registered language e.g., 'i-navajo'.
 *    •   The letter 'x': an unofficial language e.g., 'x-newspeak'.
 *    Everything else is reserved and cannot be assigned.
 *
 * -  The second subtag also has some constraints:
 *    •   A two-letter tag: a ISO 3166 alpha-2 country code e.g., 'en-GB'.
 *    •   3-8 letters tag: a dialect or variant e.g., 'en-cockney'.
 *    •   3-8 letters tag: a language not part of ISO 639 e.g., 'i-cherokee', 'x-klingon'.
 *    •   3-8 letters tag: a script variation e.g., 'az-arabic', 'az-cyrillic'.
 *
 * However `xml:lang` attributes in the CSL ecosystem seem to follow only two patterns: `xx` or `xx-YY`.
 * (Where `xx` is a ISO 639 language and `YY` a ISO 3166 alpha-2 country code.)
 *
 * Locale files are named following these patterns.
 * An index of all language codes for which we have localized data is defined in index.json.
 *
 * It is important to disambiguate the meaning of a dialect in CSL.
 * CSL defines a primary dialect and secondary dialect(s) for any languages.
 *
 * For example, the primary dialect of Spanish is `es-ES`,
 * and its secondary dialects are `es-CL` and `es-MX`.
 *
 * This is useful in two circumstances:
 *
 * 1  If a style only refers to a language, it will use localized data for its primary dialect.
 *
 * 2  If some localized data cannot be found for a secondary dialect,
 *    we can use the localized data of the primary dialect.
 *
 * Cf. http://docs.citationstyles.org/en/1.0.1/specification.html#locale-fallback
 */
/**
 * @private
 * @module @customcommander/csl-locales/private
 */
/**
 */

var R = require('ramda');
var undef = R.always(void 0);
var getDefaultLangCode = R.always('en-US');

/**
 * Maps each language and secondary dialect to its primary dialect.
 *
 * @example
 * langMap['fr'];    //=> 'fr-FR'
 * langMap['fr-ca']; //=> 'fr-FR'
 * langMap['fr-fr']; //=> 'fr-FR'
 *
 * @type {object}
 */
var langMap =
  R.pipe(                         // << {'fr': ['fr-FR', 'fr-CA']}
    R.toPairs,                    // >> [['fr', ['fr-FR', 'fr-CA']]]
    R.transduce(                  // ..
      R.compose(                  // ..
        R.map(R.apply(R.append)), // >> ['fr-FR', 'fr-CA', 'fr']
        R.map(                    // ..
          R.chain(                // ..
            R.map,                // ..
            R.useWith(            // ..
              R.flip(R.pair), [   // ..
                R.head,           // ..
                R.toLower]))),    // >> [['fr-fr', 'fr-FR'], ['fr-ca': 'fr-FR'], ['fr', 'fr-FR']]
        R.map(R.fromPairs)),      // >> {'fr-fr': 'fr-FR', 'fr-ca': 'fr-FR', 'fr': 'fr-FR'}
      R.flip(R.append),
      []),
    R.mergeAll)
      (require('./index.json'));

/**
 * @example
 * requireLocaleFile('fr');    //=> require('./locales-fr-FR.json')
 * requireLocaleFile('fr-ca'); //=> require('./locales-fr-CA.json')
 *
 * @function
 * @param {string} langCode
 * @return {locale}
 */
var requireLocaleFile =
  R.pipe(                                  // << 'FR-CA'           | << 'EN'              | << 'AR'
    R.toLower,                             // >> 'fr-ca'           | >> 'en'              | >> 'ar'
    R.unless(R.contains('-'),              // N/A                  |                      | ..
      R.prop(R.__, langMap)),              // N/A                  | >> 'en-US'           | >> 'ar'
    R.when(R.contains('-'),                // ..                   | ..                   | N/A
      R.pipe(                              // ..                   | ..                   | N/A
        R.split('-'),                      // >> ['fr', 'ca']      | >> ['en', 'US']      | N/A
        R.over(R.lensIndex(1), R.toUpper), // >> ['fr', 'CA']      | >> ['en', 'US']      | N/A
        R.join('-'))),                     // >> 'fr-CA'           | >> 'en-US'           | N/A
    R.concat('./locales-'),                // >> './locales-fr-CA' | >> './locales-en-US' | >> './locales-ar'
    require);

/**
 * Checks if two strings are case-insensitive equal.
 *
 * @example
 * caseInsensitiveEquals('hello', 'HELLO'); //=> true
 * caseInsensitiveEquals('hello', 'world'); //=> false
 *
 * @function
 * @param {string} strA
 * @param {string} strB
 * @return {boolean}
 */
var caseInsensitiveEquals =
  R.useWith(
    R.equals, [
      R.toLower,
      R.toLower]);

/**
 * True if given language code represents either English (en)
 * or American English (en-US).
 *
 * @example
 * isDefaultLangCode('en'); //=> true
 * isDefaultLangCode('EN'); //=> true
 * isDefaultLangCode('EN-US'); //=> true
 * isDefaultLangCode('fr'); //=> false
 *
 * @function
 * @param {string} langCode
 * @return {boolean}
 */
var isDefaultLangCode =
  R.either(
    caseInsensitiveEquals('en'),
    caseInsensitiveEquals('en-US'));

/**
 * Checks if given locale corresponds to given language code.
 *
 * @example
 * var isFrench = langIs('fr');
 * isFrench({'xml:lang': 'fr'}); //=> true
 * isFrench({'xml:lang': 'en'}); //=> false
 *
 * @function
 * @param {string} langCode
 * @param {locale} locale
 * @return {boolean}
 */
var langIs = R.useWith(caseInsensitiveEquals, [R.identity, R.propOr('', 'xml:lang')])

/**
 * Checks if given locale has no associated language. (i.e. its `xml:lang` property is not set)
 *
 * @example
 * langIsUndefined({}); //=> true
 * langIsUndefined({'xml:lang': 'fr'}); //=> false
 *
 * @function
 * @param {string} langCode
 * @param {locale} locale
 * @return {boolean}
 */
var langIsUndefined = R.complement(R.has('xml:lang'));

/**
 * Takes a language code and returns a function
 * that takes a locale and returns true if that locale matches
 * the language code.
 *
 * If the language code is undefined, the function will return
 * true if the locale does not define a `xml:lang` property.
 *
 * @example
 * var isFrench = generateLanguagePredicate('fr');
 * isFrench({'xml:lang': 'fr'}); //=> true
 * isFrench({'xml:lang': 'en'}); //=> false
 *
 * var hasNoLang = generateLanguagePredicate(undefined);
 * hasNoLang({}); //=> true
 * hasNoLang({'xml:lang': 'fr'}); //=> false
 *
 * @function
 * @param {string} langCode
 * @return {function}
 */
var generateLanguagePredicate =
  R.ifElse(R.isNil,
    R.always(langIsUndefined),
    R.unary(langIs));

/**
 * Picks locales from `styleLocales` that match the language codes in `langCodes`
 * If a language code is set to undefined, a locale with no `xml:lang` property will match.
 * The order of the locales that have been picked, matches the order of the language codes in `langCodes`.
 *
 * @example
 * pickFromStyleLocales(['fr', 'x-klingon', undefined],
 *  [{},
 *   {'xml:lang': 'en'},
 *   {'xml:lang': 'x-klingon'},
 *   {'xml:lang': 'fr'}]);
 *
 * //=> [{'xml:lang':'fr'}, {'xml:lang': 'x-klingon'}, {}]
 *
 * @param {string[]} langCodes
 * @param {locale[]} styleLocales
 * @return {locale[]}
 */
function pickFromStyleLocales(langCodes, styleLocales) {
  return R.transduce(
    R.compose(
      R.map(generateLanguagePredicate),
      R.map(R.find(R.__, styleLocales)),
      R.reject(R.isNil)),
    R.flip(R.append),
    [],
    langCodes);
}

/**
 * Accept a list of functions and returns a function that takes a value and applies it to these function.
 * Results are returned into an array.
 *
 * @example
 * var transform = listWith(R.inc, R.dec, R.add(10));
 * transform(5); //=> [6, 4, 15]
 *
 * @function
 * @param {...function} fns
 * @return {function}
 */
var listWith = R.unapply(R.juxt);

/**
 * Returns the language part of a language code.
 *
 * @example
 * getLanguage('en-US'); //=> 'en'
 *
 * @function
 * @param {string} langCode
 * @return {string}
 */
var getLanguage = R.takeWhile(R.complement(R.equals('-')));

/**
 * Returns the language code of the primary dialect
 * that corresponds to given language code.
 *
 * @example
 * getPrimaryDialect('fr-ca'); //=> 'fr-fr'
 * getPrimaryDialect('fr');    //=> 'fr-fr'
 * getPrimaryDialect('fr-fr'); //=> 'fr-fr'
 *
 * @function
 * @param {string} langCode Language code
 * @return {string} Primary dialect language code
 */
var getPrimaryDialect = R.pipe(R.toLower, R.propOr('', R.__, langMap));

/**
 * True if given `langCode` is a 'known' language code.
 *
 * A known language code can be mapped to a locale file
 * in the `vendor/locales` directory.
 *
 * @example
 * isLangCode('fr'); //=> true (can be mapped to `locales-fr-FR.xml`)
 * isLangCode('fr-CA'); //=> true (can be mapped to `locales-fr-CA.xml`)
 * isLangCode('en-AU'); //=> false (valid language code but there is no data for it at this time)
 *
 * @function
 * @param {string} langCode
 * @return {boolean}
 */
var isLangCode = R.pipe(R.toLower, R.has(R.__, langMap));

/**
 * True if a language code represents a language,
 * and not a primary or secondary dialect.
 *
 * @example
 * isLanguage('fr'); //=> true
 * isLanguage('fr-FR'); //=> false
 * isLanguage('fr-CA'); //=> false
 *
 * @function
 * @param {string} langCode
 * @return {boolean}
 */
var isLanguage = R.both(R.complement(R.contains('-')), isLangCode);

/**
 * True if a language code represents a dialect (primary or secondary),
 * and not a language.
 *
 * @example
 * isDialect('fr-CA'); //=> true
 * isDialect('fr'); //=> false
 *
 * @function
 * @param {string} langCode
 * @return {boolean}
 */
var isDialect = R.both(R.contains('-'), isLangCode);

/**
 * True if a language code represents a primary dialect,
 * and not a language or secondary dialect.
 *
 * @example
 * isPrimaryDialect('fr-FR'); //=> true
 * isPrimaryDialect('fr-CA'); //=> false
 * isPrimaryDialect('fr'); //=> false
 *
 * @function
 * @param {string} langCode
 * @return {boolean}
 */
var isPrimaryDialect = R.converge(caseInsensitiveEquals, [R.identity, getPrimaryDialect]);

/**
 * True if given language code cannot be mapped to a locale file
 * in the `vendor/locales` directory.
 *
 * @example
 * isUnknownLangCode('en-AU'); //=> true (cannot be mapped to `vendor/locales/locales-en-AU.xml)`
 * isUnknownLangCode('en-GB'); //=> false (can be mapped to `vendor/locales/locales-en-GB.xml)`
 *
 * @function
 * @param {string} langCode
 * @return {boolean}
 * @see isLangCode
 */
var isUnknownLangCode = R.complement(isLangCode);

/**
 * Takes a language code and returns a prioritised
 * list of language codes of locales files to require.
 *
 * @function
 * @param {string} langCode language code
 * @return {string[]} array of language codes
 * @see pickFromPackage
 */
var packageList =
  R.cond([
    // if language code is unknown or is the default one
    // always use the default language code.
    [R.either(isDefaultLangCode, isUnknownLangCode),
      listWith(getDefaultLangCode)],
    // if language code is a language or a primary dialect
    // first use its primary dialect then use the default language code
    [R.either(isLanguage, isPrimaryDialect),
      listWith(getPrimaryDialect, getDefaultLangCode)],
    // at this stage, this is a secondary dialect
    // use it first, then use its primary dialect, finally use the default language code
    [R.T,
      listWith(R.identity, getPrimaryDialect, getDefaultLangCode)]]);

/**
 * Given a language code returns a prioritised list of locales objects.
 *
 * @example
 * pickFromPackage('fr');
 * //=> [{'xml:lang': 'fr-FR'}, {'xml:lang': 'en-US'}]
 *
 * pickFromPackage('fr-CA');
 * //=> [{'xml:lang': 'fr-CA'}, {'xml:lang': 'fr-FR'}, {'xml:lang': 'en-US'}]
 *
 * pickFromPackage('x-klingon');
 * //=> [{'xml:lang': 'en-US'}]
 *
 * @function
 * @function
 * @param {string} langCode
 * @return {locales[]}
 * @see packageList
 */
var pickFromPackage =
  R.pipe(
    packageList,
    R.transduce(
      R.compose(
        R.map(requireLocaleFile),
        R.reject(R.isNil)),
      R.flip(R.append),
      []));

/**
 * Takes a language code and returns a prioritised
 * list of language codes to extract from the style locales.
 * @function
 * @param {string} langCode language code
 * @return {string[]} array of language codes
 * @see pickFromStyle
 * @see pickFromStyleLocales
 */
var styleList =
  R.cond([
    // if either a primary or secondary dialect
    // find a locales object with a corresponding 'xml:lang' property
    // then find a locales object for its corresponding language
    // then find a locales object with no associated language.
    [isDialect,
      listWith(R.identity, getLanguage, undef)],
    // if language code
    // first find a locales object with an 'xml:lang' property set to its primary dialect
    // then find a locales object for that language
    // then find a locales object with no associated language
    [isLanguage,
      listWith(getPrimaryDialect, R.identity, undef)],
    // at this stage, the language code is unknwon
    // first find a locales object with an 'xml:lang' property set to that unknown language code
    // then find a locales object with no associated language
    [R.T,
      listWith(R.identity, undef)]]);

/**
 * @function
 * @param {string} langCode
 * @param {locale[]} styleLocales
 * @return {locale[]}
 * @see pickFromStyleLocales
 * @see styleList
 */
var pickFromStyle =
  R.useWith(
    pickFromStyleLocales, [
      styleList,
      R.identity]);

/**
 * Returns a prioritised list of locales object based on a given language code.
 * Locales object are first dranw from the style locales then from the locales
 * files in this repository.
 *
 * @function
 * @param {string} langCode
 * @param {locale[]} styleLocales
 * @return {locale[]}
 * @see pickFromStyle
 * @see pickFromPackage
 */
module.exports =
  R.converge(
    R.concat, [
      pickFromStyle,
      pickFromPackage]);
