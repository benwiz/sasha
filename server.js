'use strict';

// external libs
const Promise = require('bluebird');
const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');
const Swagger = require('hapi-swagger');
const _ = require('lodash');
const Fs = require('fs');
const Console = console.constructor;
// internal libs
const Mopidy = require('./server/handlers/actuators/lib/mopidy');
const Routes = require('./server/routes/index');
if (module.parent) { require('./logfile')('./public/assets/node_log.txt'); }

// check for environment variables
const env_vars = ['MOPIDY_HOST', 'WATSON_USERNAME', 'WATSON_PASSWORD'];
_.forEach(env_vars, (env_var) => {

    if (!process.env[env_var]) {
        console.log(`${env_var} environment variable not set!\nexiting...`);
        process.exit(1);
    }
});

// create server
const server = new Hapi.Server();
server.connection({
    port: Number(process.env.PORT || 8081), // env var used in elastic beanstalk
    host: '0.0.0.0'
});

const swagger_options = {
    info: {
        title: 'Sasha Sensor API'
    }
};

const start = () => {

    return new Promise((resolve) => {

        Mopidy.ready().then(() => {

            server.register([Vision, Inert, {register: Swagger, options: swagger_options}], (err) => {

                Hoek.assert(!err, err);

                // set up views and layouts using handlebars
                server.views({
                    engines: {
                        html: Handlebars
                    },
                    relativeTo: __dirname,
                    path: 'server/views',
                    layout: true,
                    layoutPath: 'server/views/layouts',
                    partialsPath: 'server/views/partials'
                });

                // set up routes
                server.route(Routes);

                // start server
                server.start((err) => {

                    if (err) {
                        console.log('Error starting server:', err);
                    }
                    console.log('Server started at:', server.info.uri);
                    resolve();
                });
            });
        });
    });
};

if (module.parent) {
    module.exports = { start };
} else {
    start();
}
