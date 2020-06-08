'use strict';
require('./utils/database')
const server = require('./server');
const routes = require('./routes');

const init = async () => {
    const serverHapi = server.server;
    await serverHapi.register(routes);
    await serverHapi.start();

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();