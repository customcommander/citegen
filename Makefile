# npm packages
prettier = ./node_modules/.bin/prettier
tape = ./node_modules/.bin/tape
tape_args = -r babel-register
nyc = ./node_modules/.bin/nyc
nyc_args = --reporter html


lib_files = $(shell find src/js -type f -name "csl-*.js" -not -name "*.test.js")
csl_files = $(shell find test/styles -type f -name "*.csl")

js_src = $(shell find src/js -type f -name "*.js")
xsl_src = $(shell find src/xsl -type f -name "*.xsl")

build_lib = $(patsubst src/js/csl-%.js,build/lib/%.js,$(lib_files))
build_modules = $(patsubst test/styles/%.csl,build/%.js,$(csl_files))

build: $(build_lib) $(build_modules)
	touch $@

unit-test: tmp/unit-test
integration-test: tmp/integration-test

clean:
	rm -rfv build
	rm -rfv tmp/unit-test

build/lib/%.js: src/js/csl-%.js
	mkdir -p $(dir $@)
	cp $< $@

build/%.js: test/styles/%.csl $(js_src) $(xsl_src)
	mkdir -p $(dir $@)
	xsltproc src/xsl/module.xsl $< | $(prettier) | tee $@

# Private targets

tmp/unit-test: $(shell find src/js -type f -name "*.js")
	BABEL_ENV=test $(nyc) $(nyc_args) $(tape) $(tape_args) src/js/*.test.js
	mkdir -p $(dir $@)
	touch $@

tmp/integration-test: build
	BABEL_ENV=test $(nyc) $(nyc_args) $(tape) $(tape_args) test/*.test.js
	mkdir -p $(dir $@)
	touch $@
