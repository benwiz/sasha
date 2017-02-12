'use strict';

const Handler = require('../../handlers/apis/index');
const Validator = require('../../handlers/apis/validator');

module.exports = [

    // speech-to-text
    {
        method: 'POST',
        path: '/speech-to-text',
        handler: Handler.speechToText,
        config: {
            validate: Validator.speechToText
        }
    }
];
