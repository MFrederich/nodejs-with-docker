FROM node as builder

# Install app dependencies
COPY package*.json ./

#Install dependencies.
RUN npm install

##########################################

FROM node:alpine as app

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

#Copy generated node modules
COPY --from=builder node_modules .

#Enable port 8080
EXPOSE 8080

#Run npm docker
CMD [ "npm", "run", "docker" ]