FROM node:14-alpine
WORKDIR /app
COPY . .
RUN yarn
ENTRYPOINT [ "node", "./entrypoint.js" ]