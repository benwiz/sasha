'use strict';

// external libs
const Joi = require('joi');
// internal libs
const Handler = require('../../handlers/sensors/index');

module.exports = [

    // POST /text
    {
        method: 'POST',
        path: '/text',
        handler: Handler.text,
        config: {
            validate: {
                payload: Joi.string().required()
            },
            description: 'Post text',
            notes: 'Post plain text.',
            tags: ['api']
        }
    },

    // POST /audio
    {
        method: 'POST',
        path: '/audio',
        handler: Handler.audio,
        config: {
            validate: {
                payload: Joi.binary().required()
            },
            description: 'Post audio',
            notes: 'Post audio file.',
            tags: ['api']
        }
    },

    // POST /image
    {
        method: 'POST',
        path: '/image',
        handler: Handler.image,
        config: {
            validate: {
                payload: Joi.binary().required()
            },
            description: 'Post image',
            notes: 'Post binary image file.',
            tags: ['api']
        }
    },

    // POST /video
    {
        method: 'POST',
        path: '/video',
        handler: Handler.video,
        config: {
            validate: {
                payload: Joi.binary().required()
            },
            description: 'Post video',
            notes: 'Post binary video file.',
            tags: ['api']
        }
    }
];
