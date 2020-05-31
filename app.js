'use strict';

const Hapi = require('@hapi/hapi');

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const Pack = require('./package');

const init = async () => {
    
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0' //localhost:3000 in local machine. This is used for Docker. 
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

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

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
    
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();