node_bin = ./node_modules/.bin

validate-csl: tmp/validate-csl

clean:; rm -rfv tmp

tmp/validate-csl: $(shell find ./features -type f -name "*.feature")
	mkdir -p $(@D)
	parallel $(node_bin)/csl-validate {} ::: $^
	touch $@

test:
	$(node_bin)/cucumber-js -r ../csl-features-support/lib features

.PHONY: validate-csl test
