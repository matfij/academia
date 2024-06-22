FROM node:alpine

WORKDIR /app
# USER node

COPY package.json .
COPY yarn.lock .
RUN yarn install

CMD ["yarn", "dev"]
