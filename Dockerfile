FROM node:16

EXPOSE 8099
WORKDIR /home/node/app
ENV GOOGLE_APPLICATION_CREDENTIALS=/data/serviceaccount.json

COPY package*.json ./
RUN npm ci

COPY index.js ./

CMD [ "node", "index.js" ]
