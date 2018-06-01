#!/usr/bin/parallel --shebang-wrap /bin/sh

dist_dir=$(dirname $(realpath $0))/dist
js_file=$dist_dir/$(basename $1 .csl).js

./node_modules/.bin/csl-generator $1 >$js_file
