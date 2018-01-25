FROM node:8-alpine

RUN apk update && \
  apk add make && \
  apk add libxslt && \
  apk add parallel && \
  (printf "will cite" | parallel --citation)

CMD ["sh"]
