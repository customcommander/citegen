[![Build Status](https://travis-ci.org/customcommander/citegen.svg?branch=master)](https://travis-ci.org/customcommander/citegen)

# citegen

### Development

Make                    | Description
------------------------|----------------------------------------------------------------
`make build-docker`     | Builds the Docker image
`make start-docker`     | Runs a Docker container
`make stop-docker`      | Stops the Docker container
`make test`             | Runs unit tests across packages

#### Useful Tips

1.  See what files will be packaged:

    ```
    cd packages/<package name>
    npm pack && tar -xvzf *.tgz && rm -rf package *.tgz
    ```