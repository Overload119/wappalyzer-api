FROM node:14-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_BIN /usr/bin/chromium-browser

RUN apk update
RUN apk add --no-cache \
	nodejs \
	npm \
  udev \
  chromium \
  ttf-freefont \
  python3 \
  make \
  build-base \
  git \
  tini

RUN mkdir /app && chown node /app
USER 1000
WORKDIR /app

ADD *.json /app/
RUN npm i

ADD *.js /app/

# Add Tini
ENTRYPOINT ["/sbin/tini", "--"]

RUN /usr/bin/chromium-browser --version

CMD ["node", "app.js"]
