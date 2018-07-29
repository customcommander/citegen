FROM ubuntu:latest

COPY ./vendor/schema /var/csl/

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y make xsltproc parallel jing nodejs yarn
RUN parallel --no-notice

CMD ["bash"]
