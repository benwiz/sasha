'use strict';

// GET index
const index = (request, reply) => {

    reply.view('index');
};

// GET config
const config = (request, reply) => {

    reply.view('config');
};


module.exports = {
    index: index,
    config: config
};
