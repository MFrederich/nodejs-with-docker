'use strict';

const hapi = require('@hapi/hapi');

module.exports = {
    server: hapi.server({
        port: 3000,
        host: 'localhost'
    })
}
