'use strict';

// GET config
const config = (request, reply) => {

    console.log(request.payload);
    reply.redirect('/');
};

module.exports = {
    config: config
};
