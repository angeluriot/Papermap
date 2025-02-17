FROM node:lts-slim as run

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "node", "build" ]
