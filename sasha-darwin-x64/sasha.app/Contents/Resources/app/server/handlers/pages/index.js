'use strict';

// GET index
const index = (request, reply) => {

    reply.view('index');
};

// GET config
const config = (request, reply) => {

    const data = {
        watson_username: 'secret',
        watson_password: 'secret',
        mopidy_host: process.env.MOPIDY_HOST
    };
    reply.view('config', data);
};


module.exports = {
    index: index,
    config: config
};
