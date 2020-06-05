'use strict';
require('dotenv').config();
const hapi = require('@hapi/hapi');

module.exports = {
    server: hapi.server({
        port: process.env.SERVER_PORT,
        host: 'localhost'
    })
}
