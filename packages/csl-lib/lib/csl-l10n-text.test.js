var tap = require('tap');
var l10nText = require('./csl-l10n-text');

var l10nTextWithLocales = l10nText([{
  terms: [
    {name: 'developer', single: 'developer', multiple: 'developers'},
    {name: 'developer', form: 'short', single: 'dev', multiple: 'devs'}
  ]
}]);

tap.equal(l10nTextWithLocales({term: 'developer'}), 'developer',
  'should return the single version by default');

tap.equal(l10nTextWithLocales({term: 'developer', plural: 'true'}), 'developers',
  'should return the plural version when requested');

tap.equal(l10nTextWithLocales({term: 'developer', form: 'short'}), 'dev',
  'should return the short single version by default');

tap.equal(l10nTextWithLocales({term: 'developer', form: 'short', plural: 'true'}), 'devs',
  'should return the short plural version when requested');

tap.equal(l10nTextWithLocales({term: 'ninjaneer'}), '',
  'should return an empty string when a term does not exist in the `locales` array');
