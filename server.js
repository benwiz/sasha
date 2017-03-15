'use strict';

// external libs
const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');
const Swagger = require('hapi-swagger');
const Fs = require('fs');
// internal libs
const Routes = require('./server/routes/index');
const Logfile = require('./logfile.js')('./public/assets/node_log.txt');


// create server
const server = new Hapi.Server();
server.connection({
    port: Number(process.env.PORT || 8081), // env var used in elastic beanstalk
    host: '0.0.0.0'
});

const swagger_options = {
    info: {
        'title': 'Sasha Sensor API',
    }
};

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
    });
});
