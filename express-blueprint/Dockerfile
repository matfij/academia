FROM node:alpine

WORKDIR /app
# USER node

COPY package.json .
RUN yarn install

CMD ["yarn", "dev"]
