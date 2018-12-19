tap = ./node_modules/.bin/tap

test:
	$(tap) \
		--bail \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- '**/*.test.js'

index.js:
	ls -1 ./lib/*.js | awk -f index.js.awk >$@

.PHONY: index.js
