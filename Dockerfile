FROM node:18-alpine

WORKDIR /srv
ENV NODE_ENV=production

COPY package.json package-lock.json /srv/
RUN npm ci
COPY ./src/ /srv/src/

USER 1000:1000
CMD [ "/usr/local/bin/node", "/srv/src/index.mjs"]
