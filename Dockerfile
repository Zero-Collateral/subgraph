FROM node:14-alpine
RUN yarn
WORKDIR /app
COPY . .
ENTRYPOINT [ "./entrypoint.sh" ]