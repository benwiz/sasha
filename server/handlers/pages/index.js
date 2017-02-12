'use strict';

// GET index
const index = (request, reply) => {

    reply.view('index');
};


module.exports = {
    index: index
};
