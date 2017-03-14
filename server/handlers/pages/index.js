'use strict';

// local libraries

// GET /
const index = (request, reply) => {

    reply.view('index');
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

// GET /speak
const speak = (request, reply) => {

    reply.view('speak');
}

module.exports = {
    index,
    config,
    speak
};
