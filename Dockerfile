FROM node:0.12
# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; npm install
# default port
EXPOSE 8080
# default comand
CMD ["npm", "start"]
