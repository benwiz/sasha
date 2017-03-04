'use strict';

const ActuatorConfig = require('../actuators/lib/config');

// GET config
const config = (request, reply) => {

    const payload = request.payload;
    if (payload.mopidy_host) ActuatorConfig.mopidy_host = payload.mopidy_host;
    if (payload.watson_username) ActuatorConfig.watson_username = payload.watson_username;
    if (payload.watson_password) ActuatorConfig.watson_password = payload.watson_password;

    reply.redirect('/');
};

module.exports = {
    config: config
};
