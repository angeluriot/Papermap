FROM node:lts-slim AS run

RUN apt-get update && apt-get install -y fontconfig

WORKDIR /Papermap

COPY . .
RUN npm install --omit=dev
RUN NODE_OPTIONS="--max_old_space_size=2048" npm run build

EXPOSE 3000
CMD [ "node", "server.js" ]
