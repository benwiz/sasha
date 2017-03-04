'use strict';

// external libs
const Joi = require('joi');
// internal libs
const Handler = require('../../handlers/api/index');

module.exports = [

    // POST /config
    {
        method: 'POST',
        path: '/config',
        handler: Handler.config,
        config: {
            validate: {
                payload: Joi.object({
                    mopidy_host: Joi.string().allow('').optional(),
                    watson_username: Joi.string().allow('').optional(),
                    watson_password: Joi.string().allow('').optional()
                })
            },
            description: 'Post config',
            notes: 'Post configuration.',
            tags: ['api']
        }
    }
];
