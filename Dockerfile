FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

#Install dependencies.
RUN npm install

# Bundle app source
COPY . .

#Enable port 8080
EXPOSE 8080

#Run npm docker
CMD [ "npm", "run docker" ]