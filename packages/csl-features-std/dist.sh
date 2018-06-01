#!/usr/bin/parallel --shebang-wrap /bin/sh

#
# EXAMPLE
#
# ./dish.sh test.txt
#
# OVERVIEW
#
# The script takes as its sole argument the path to a test file
# as described by the `citation-style-language/test-suite` specification.
#
# It validates the XML content of the `CSL` section: (Cf. the csl-features-support package.)
#
# >>===== CSL =====>>
# <style>
#   <!-- Some valid citation style -->
# </style>
# <<===== CSL =====<<
#
# If the XML is valid, it converts the test file into a feature file
# using Gherkin. The feature file will be available in the `dist` directory.
#

node_bin=./node_modules/.bin
dist_file=dist/$(basename $1 .txt).feature

$node_bin/csl-validate $1
valid=$?

if [ $valid -ne 0 ]; then
  echo "The 'CSL' section in '$1' does not validate against the schema. Skip"
else
  ./txt-to-gherkin/convert.sh $1 >$dist_file
fi
