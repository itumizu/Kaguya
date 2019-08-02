FROM node:latest

ADD yarn.lock /yarn.lock
# ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN yarn

WORKDIR /system
ADD . /system