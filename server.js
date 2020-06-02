
'use strict';

//Load dotenv to read environment variables.
require('dotenv').config()

const Hapi = require('@hapi/hapi');

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const Pack = require('./package');

const server = Hapi.server({
    port: process.env.PORT ?? 3000,
    host: process.env.HOST ?? '0.0.0.0' //localhost:3000 in local machine. This is used for Docker. 
});

//Get Routes.
server.route(require('./routes'));

//Set Swagger
const swaggerOptions = {
    info: {
        title: 'Simple CRUD API Documentation',
        version: Pack.version,
    },
};

//Swagger documentation redirect.
server.route({
    method: 'GET',
    path: "/",
    handler: function (request, h) {
        return h.redirect(`${request.url.origin}/documentation`)
    }
});

//404 error
server.route({
    method: '*',
    path: '/{any*}',
    handler: function (request, h) {
        
        return '404 Error! Page Not Found!';
    }
});

// Export the server to be required elsewhere.
module.exports = {
    server: server,
    swaggerInit: [
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]
};