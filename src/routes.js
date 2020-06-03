'use strict';

module.exports = {
        name: 'route',
        register: async (server, options) => {
            server.route({
                method: 'GET',
                path: '/',
                handler: (request) => {
                    return 'Hello World!';
                }
            });
        }
}