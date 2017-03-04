'use strict';

// external libraries
const Reload = require('require-reload')(require);
// local libraries
const ActuatorConfig = require('../actuators/lib/config');

// GET config
const config = (request, reply) => {

    const payload = request.payload;
    if (payload.mopidy_host) process.env.MOPIDY_HOST = payload.mopidy_host;
    if (payload.watson_username) process.env.WATSON_USERNAME = payload.watson_username;
    if (payload.watson_password) process.env.WATSON_USERNAME = payload.watson_password;

    Reload('../actuators/lib/config.js');
    Reload('../actuators/lib/mopidy.js');
    Reload('../actuators/lib/speech-to-text.js');

    reply.redirect('/');
};

module.exports = {
    config: config
};
