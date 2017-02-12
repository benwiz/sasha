'use strict';

const Handler = require('../../handlers/apis/index');
const Validator = require('../../handlers/apis/validator');

module.exports = [

    // POST speech-to-text
    {
        method: 'POST',
        path: '/speech-to-text',
        handler: Handler.speechToText,
        config: {
            validate: Validator.speechToText
        }
    },

    // POST nlp
    {
        method: 'POST',
        path: '/nlp',
        handler: Handler.nlp,
        config: {
            validate: Validator.nlp
        }
    },

    // POST text-to-speech
    {
        method: 'POST',
        path: '/text-to-speech',
        handler: Handler.textToSpeech,
        config: {
            validate: Validator.textToSpeech
        }
    },

    // GET joke
    {
        method: 'GET',
        path: '/joke',
        handler: Handler.joke,
        config: {
            validate: Validator.joke
        }
    },

    // GET fact
    {
        method: 'GET',
        path: '/fact',
        handler: Handler.fact,
        config: {
            validate: Validator.fact
        }
    },

    // POST /play/spotify
    {
        method: 'POST',
        path: '/play/spotify',
        handler: Handler.mopidy.spotify,
        config: {
            validate: Validator.playSpotify
        }
    },

    // POST /play/buffer
    {
        method: 'POST',
        path: '/play/buffer',
        handler: Handler.mopidy.buffer,
        config: {
            validate: Validator.playBuffer
        }
    },

    // POST /play/url
    {
        method: 'POST',
        path: '/play/url',
        handler: Handler.mopidy.url,
        config: {
            validate: Validator.playUrl
        }
    }
];
