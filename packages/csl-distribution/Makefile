csl_generator = ./node_modules/.bin/csl-generator

dist:
	mkdir -p styles
	find ../../vendor/styles-distribution -type f -name "*.csl" | parallel --progress $(csl_generator) {} styles/{/.}.js

.PHONY: dist
