#server/Dockerfile

FROM node:14-alpine3.12

ENV SERVICE_USER=audiogaze
ENV SERVICE_GROUP=audiogaze

RUN addgroup -S ${SERVICE_GROUP} && adduser -S ${SERVICE_USER} -G ${SERVICE_GROUP}

COPY --chown=audiogaze:audiogaze . /webapp/server

WORKDIR /webapp/server

RUN apk add --no-cache --virtual .apk-dev-deps python3 make g++ gcc git\
&& npm install \
&& apk del .apk-dev-deps

CMD ["npm","run","start"]