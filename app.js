'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {
    
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0' //localhost:3000 in local machine. This is used for Docker. 
    });
    
    //Get Routes.
    server.route(require('./routes'));

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