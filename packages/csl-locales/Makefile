locales_dir = ../../vendor/locales
locales_xml = $(shell find $(locales_dir) -type f -name "*.xml")
tap = ./node_modules/.bin/tap

build: lib index.js

lib: $(patsubst $(locales_dir)/%.xml,lib/%.json,$(locales_xml))

lib/%.json: $(locales_dir)/%.xml lib/xml2json.xsl
	xsltproc ./lib/xml2json.xsl $< | echo 'JSON.stringify(' $$(cat) ', null, 2)' | node -p - >$@

index.js: lib index.js.awk
	find ./lib -type f -name "*.json" | awk -f index.js.awk >$@

clean:
	rm -rfv lib/*.json
