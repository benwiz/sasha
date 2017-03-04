'use strict';

// GET config
const config = (request, reply) => {

    console.log(request.payload);
    reply('hey');
};

module.exports = {
    config: config
};
