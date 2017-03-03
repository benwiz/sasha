'use strict';

// external libraries
const Promise = require('bluebird');
const GoogleTTS = require('google-tts-api');

const googleTranslate = (options) => {

    return new Promise((resolve, reject) => {

        GoogleTTS(options.text, 'en', 1)   // speed normal = 1 (default), slow = 0.24
            .then((url) => {

                console.log(url);
                reply({url: url});
            })
            .catch((err) => {

              console.error(err.stack);
              reject(err);
            });
    });
};

module.exports = {
    googleTranslate: googleTranslate
};
