tap = ./node_modules/.bin/tap

test:
	$(tap) \
		--bail \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- '**/*.test.js'

.PHONY: index.js
