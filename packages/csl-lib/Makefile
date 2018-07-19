tap = ./node_modules/.bin/tap

test:
	$(tap) \
		--bail \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- '**/*.test.js'

index.js:
	find ./lib -type f -name "csl-node-*.js" -and -not -name "*.test.js" | awk -f index.js.awk >$@

.PHONY: index.js
