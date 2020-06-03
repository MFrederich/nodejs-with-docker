'use strict';

const hapi = require('@hapi/hapi');

module.exports = async(routes)=>  {

    const server = hapi.server({
        port: 3000,
        host: 'localhost'
    });
    await server.register(routes);
    await server.start();
};
