FROM node:lts-slim AS run

RUN apt-get update && apt-get install -y fontconfig

WORKDIR /Papermap

COPY . .
RUN npm install --omit=dev
RUN npm run build

EXPOSE 3000
CMD [ "node", "build" ]
