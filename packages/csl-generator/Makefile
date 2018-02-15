csl_files = $(shell find test/csl -type f -name "*.csl")
cucumber = ./node_modules/.bin/cucumber-js
test_files := $(shell find integration -type f)
features_files = $(filter %.feature,$(test_files))

test: csl-check
	$(cucumber) --fail-fast --exit integration/

csl-check: tmp/csl-check
tmp/csl-check: $(patsubst integration/features/%.feature,tmp/csl-check/%.feature,$(features_files))

tmp/csl-check/%.feature: integration/features/%.feature
	mkdir -p $(dir $@)
	cat $< | sed -n -e '/<style/,/<\/style/p' | awk '/<style/{x=++i;}{print > "$(dir $@)/$*-"x".xml"}'
	find $(dir $@) -type f -name "$*-*" -print0 | xargs -0 -n1 jing -c /var/csl/csl.rnc
	touch $@

clean:; rm -rfv tmp

.PHONY: test
