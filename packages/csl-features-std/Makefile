all: dist README.md

dist:
	mkdir -p $@
	./dist.sh $(shell find ../../vendor/test-suite/processor-tests/humans -type f -name "*.txt")

README.md: tmp/readme-data.json read.me.mustache
	./node_modules/.bin/mustache tmp/readme-data.json read.me.mustache $@

tmp/readme-data.json: tmp/modes.txt tmp/features.txt
	mkdir -p $(@D)
	node -p -e 'JSON.stringify({modes: [$(shell cat tmp/modes.txt)], features: [$(shell cat tmp/features.txt)]}, null, 2)' >$@

tmp/modes.txt: dist
	mkdir -p $(@D)
	find $< -type f -name "*.feature" -exec awk '/@.* @.*/{print $$1}' {} \; | sort -u | awk '{print "\"" $$0 "\","}' >$@

tmp/features.txt: dist
	mkdir -p $(@D)
	find $< -type f -name "*.feature" -exec awk '/@.* @.*/{print $$2}' {} \; | sort -u | awk '{print "\"" $$0 "\","}' >$@

clean:; rm -rf dist

.PHONY: dist
