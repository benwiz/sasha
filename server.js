'use strict';

// external libs
const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');

// internal libs
const Routes = require('./server/routes/index');

// create server
const server = new Hapi.Server();
server.connection({
    port: Number(process.env.PORT || 8080), // env var used in elastic beanstalk
    host: '0.0.0.0'
});

server.register([Vision, Inert], (err) => {

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
