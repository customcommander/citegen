node_bin = ./node_modules/.bin

validate-csl: tmp/validate-csl
test: tmp/test

clean:; rm -rfv tmp

tmp/validate-csl: $(shell find ./features -type f -name "*.feature")
	mkdir -p $(@D)
	parallel $(node_bin)/csl-validate {} ::: $^
	touch $@

tmp/test: $(shell find ./features -type f -name "*.feature")
	mkdir -p tmp
	$(node_bin)/cucumber-js -r ./support.js features
	touch $@

.PHONY: validate-csl test
