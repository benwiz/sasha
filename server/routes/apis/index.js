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
];
