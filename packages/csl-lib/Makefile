tap = ./node_modules/.bin/tap

test:
	$(tap) \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- lib/*.test.js
