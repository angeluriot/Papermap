FROM node:lts-slim AS build

ENV NODE_ENV=production NODE_OPTIONS="--max_old_space_size=2048"

RUN apt-get update && apt-get install -y fontconfig && rm -rf /var/lib/apt/lists/*

WORKDIR /Papermap

COPY package.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build

FROM node:lts-slim AS run

ENV NODE_ENV=production NODE_OPTIONS="--max_old_space_size=2048"

WORKDIR /Papermap

COPY --from=build /Papermap/build ./build
COPY --from=build /Papermap/data ./data
COPY --from=build /Papermap/node_modules ./node_modules
COPY --from=build /Papermap/resources ./resources
COPY --from=build /Papermap/scripts ./scripts
COPY --from=build /Papermap/static ./static
COPY --from=build /Papermap/tmp ./tmp
COPY --from=build /Papermap/package*.json ./
COPY --from=build /Papermap/server.js ./server.js

USER node

EXPOSE 3000
CMD [ "node", "server.js" ]
