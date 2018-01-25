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

test:
ifdef CI
	docker exec $(docker_container_name) sh -c 'make -C packages/csl-lib test'
else
	make -C packages/csl-lib test
endif
