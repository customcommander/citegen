# Cf. https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
# Cf. https://yarnpkg.com/en/docs/install#debian-stable

FROM ubuntu:18.04

COPY ./vendor/schema /var/csl/

RUN apt-get update && apt-get install -f -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -f -y make xsltproc parallel jing nodejs yarn jq
RUN parallel --no-notice
RUN apt-get clean

CMD ["bash"]
