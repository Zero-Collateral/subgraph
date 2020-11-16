FROM node:14.15.0
WORKDIR /app
COPY . .
RUN yarn
RUN yarn codegen
ENTRYPOINT [ "./entrypoint.sh" ]