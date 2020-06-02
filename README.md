
# Nodejs with Docker
This is an example of a CRUD Rest Node project, with Docker Container build.

# Technologies used
- MongoDB
- Node.js dependencies:
	- `hapi`: Web Framework
	- `joi`: Part of hapi, used for Data Schema validation.
	- `boom`: Part of hapi, used to show HTTP-friendly errors.
	- `mongojs`: Easy connector for mongodb.
	- `node-uuid`: GUID generator.
	- `hapi-swagger`: Swagger generator for hapi framework.
	- `inert`: Part of hapi, static file & directores handler (used by Swagger).
	- `vision`: Part of hapi, template render (used by Swagger).
- Docker, with Docker-compose.

# Motivation
This project was used to learn about Node.js, the Hapi framework and how to create Node containers for docker.
Since this was used for learning, there is a lot of room for improvements.

# How to run
- In local: `npm start`
- With docker: `docker-compose up -d`
