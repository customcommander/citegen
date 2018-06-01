tap = ./node_modules/.bin/tap

test: tmp
	$(tap) \
		--bail \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- lib/*.test.js

csl-check: tmp/csl-check
tmp/csl-check: $(patsubst integration/features/%.feature,tmp/csl-check/%.feature,$(features_files))

tmp/csl-check/%.feature: integration/features/%.feature
	mkdir -p $(dir $@)
	cat $< | sed -n -e '/<style/,/<\/style/p' | awk '/<style/{x=++i;}{print > "$(dir $@)/$*-"x".xml"}'
	find $(dir $@) -type f -name "$*-*" -print0 | xargs -0 -n1 jing -c /var/csl/csl.rnc
	touch $@

tmp:; mkdir -p $@

clean:; rm -rfv tmp

.PHONY: test tmp
