'use strict';

const init = async () => {
    const srv = require('./server')
    const server = srv.server;
    const swaggerInit = srv.swaggerInit;
    
    await server.register(swaggerInit);
    await server.start();
    console.log('Server running on %s', server.info.uri); 
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();