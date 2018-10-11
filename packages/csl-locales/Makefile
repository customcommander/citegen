locales_dir = ../../vendor/locales
locales_xml = $(shell find $(locales_dir) -type f -name "*.xml")
tap = ./node_modules/.bin/tap

build: lib index.js

test:
	$(tap) \
		--bail \
		--cov \
		--100 \
		$(if $(CI),,--coverage-report=html --reporter=spec --no-browser) \
		-- lib/*.test.js

lib: $(patsubst $(locales_dir)/%.xml,lib/%.json,$(locales_xml)) lib/index.json

lib/index.json: $(locales_dir)/locales.json lib/index.json.jq
	jq -f lib/index.json.jq $(locales_dir)/locales.json >$@

lib/%.json: $(locales_dir)/%.xml lib/xml2json.xsl
	xsltproc ./lib/xml2json.xsl $< | echo 'JSON.stringify(' $$(cat) ', null, 2)' | node -p - >$@

index.js: lib index.js.awk
	find ./lib -type f -name "locales*.json" | awk -f index.js.awk >$@

clean:
	rm -rfv lib/*.json
