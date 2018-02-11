csl_generator = ./node_modules/.bin/csl-generator
vendor_styles = ../../vendor/styles-distribution
dist_dir = ./dist

dist:
	mkdir -p $@
	find $(vendor_styles) -type f -name "*.csl" | parallel $(csl_generator) {} $(dist_dir)/{/.}.js

.PHONY: dist
