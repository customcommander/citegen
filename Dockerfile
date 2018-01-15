FROM node:8-alpine

WORKDIR /var/citegen

COPY . .

RUN apk update \
  && apk add make \
  && apk add libxslt \
  && npm install

