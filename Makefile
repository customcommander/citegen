docker_image = citegen-dev
docker_container_name = citegen-dev-box
docker_working_dir = /var/citegen

build-docker:
	docker build -t $(docker_image):latest .

start-docker:
	docker run \
		$(if $(CI),-it -d,-it) \
		--rm \
		--mount type=bind,src=$$PWD,dst=$(docker_working_dir) \
		-w $(docker_working_dir) \
		--name $(docker_container_name) \
		$(docker_image)

stop-docker:
	docker kill $(docker_container_name)

test: csl-lib-test csl-locales-test csl-generator-test
csl-lib-test: tmp/csl-lib.test
csl-locales-test: tmp/csl-locales.test
csl-generator-test: tmp/csl-generator.test

tmp/%.test:
	docker exec $(docker_container_name) bash -c 'make -C packages/$* test'

clean:; rm -rfv tmp
