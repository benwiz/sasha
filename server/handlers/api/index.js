'use strict';

// external libraries
// local libraries
const Mopidy = require('../actuators/lib/mopidy');
const SpeechToText = require('../actuators/lib/speech-to-text');

// GET config
const config = (request, reply) => {

    const payload = request.payload;
    if (payload.mopidy_host) {
        process.env.MOPIDY_HOST = payload.mopidy_host;
        Mopidy.mopidy._settings.webSocketUrl = `ws://${payload.mopidy_host}:6680/mopidy/ws/`;
        Mopidy.mopidy.connect();
    }
    if (payload.watson_username) process.env.WATSON_USERNAME = SpeechToText.WatsonSTT._options.username = payload.watson_username;
    if (payload.watson_password) process.env.WATSON_USERNAME = SpeechToText.WatsonSTT._options.password = payload.watson_password;

    reply.redirect('/config');
};

module.exports = {
    config: config
};
