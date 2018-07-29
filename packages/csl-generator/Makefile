tap = ./node_modules/.bin/tap

test: tmp
	$(tap) \
		--bail \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- lib/*.test.js

tmp:; mkdir -p $@

.PHONY: test tmp
