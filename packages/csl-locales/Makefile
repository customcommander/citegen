locales_dir = ../../vendor/locales
locales_xml = $(shell find $(locales_dir) -type f -name "*.xml")
tap = ./node_modules/.bin/tap

build: lib

lib: $(patsubst $(locales_dir)/%.xml,lib/%.json,$(locales_xml))

lib/%.json: $(locales_dir)/%.xml
	xsltproc ./lib/xml2json.xsl $< | echo 'JSON.stringify(' $$(cat) ', null, 2)' | node -p - >$@

clean:
	rm -rfv lib/*.json
