FROM node:lts-slim as run

RUN apt-get update && apt-get install -y fontconfig

WORKDIR /Papermap

COPY . .
RUN mkdir -p ./tmp/locks
RUN mkdir -p ./tmp/images
RUN npm install --omit=dev
RUN npm run build

EXPOSE 3000
CMD [ "node", "build" ]
