'use strict';

// external libraries
var GoogleTTS = require('google-tts-api');

const googleTranslate = (request, reply) => {

    GoogleTTS(request.payload.text, 'en', 1)   // speed normal = 1 (default), slow = 0.24
        .then((url) => {

            console.log(url);
            reply(url);
        })
        .catch((err) => {

          console.error(err.stack);
          reject(err);
        });
};

module.exports = {
    goolgeTranslate: googleTranslate
};
