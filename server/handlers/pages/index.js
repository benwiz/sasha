'use strict';

// local libraries
const Package = require('../../../package.json');

// GET /
const index = (request, reply) => {

    const data = {
        version: Package.version
    };
    reply.view('index', data);
};

// GET /config
const config = (request, reply) => {

    const data = {
        watson_username: 'secret',
        watson_password: 'secret',
        mopidy_host: process.env.MOPIDY_HOST
    };
    reply.view('config', data);
};

// GET /text
const text = (request, reply) => {

    reply.view('text');
};

// GET /speak
const speak = (request, reply) => {

    reply.view('speak');
};

// GET /logs
const logs = (request, reply) => {

    const data = {
        filepath: __dirname
    };
    reply.view('logs', data);
};

module.exports = {
    index,
    config,
    text,
    speak,
    logs
};
