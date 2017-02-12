'use strict';

const Handler = require('../../handlers/apis/index');
const Validator = require('../../handlers/apis/validator');

module.exports = [

    // POST /text
    {
        method: 'POST',
        path: '/text',
        handler: Handler.text,
        config: {
            validate: Validator.text
        }
    },

    // POST /audio
    {
        method: 'POST',
        path: '/audio',
        handler: Handler.audio,
        config: {
            validate: Validator.audio
        }
    },

    // POST /image
    {
        method: 'POST',
        path: '/image',
        handler: Handler.image,
        config: {
            validate: Validator.image
        }
    },

    // POST /video
    {
        method: 'POST',
        path: '/video',
        handler: Handler.video,
        config: {
            validate: Validator.video
        }
    }
];
