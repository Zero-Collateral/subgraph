FROM node:12.16.1-alpine3.11 as build

RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories
# Create a folder for the app
RUN mkdir /app
WORKDIR /app
# Switch to the app folder to make installation
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
# Install dependencies and such
RUN apk add --no-cache --virtual .build-deps git openssh python make g++ libsecret-dev \
    && npm install keytar \
    && yarn install \
    && apk del .build-deps

FROM node:12.16.1-alpine3.11

WORKDIR /app
# Create a non root user for the app
RUN addgroup -S app && adduser -S -G app app

COPY ./entrypoint.sh /entrypoint.sh
# Make the entrypoint.sh executable
RUN chmod a+x /entrypoint.sh
# Give permissions to app user to use the file
RUN chown app:app /entrypoint.sh

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod a+x /wait

COPY --from=build /app /app
WORKDIR /app
COPY . /app
# Give full permissions to the app folder to the app user
RUN chown app:app -R /app

USER app

ENTRYPOINT ["/entrypoint.sh" ]
