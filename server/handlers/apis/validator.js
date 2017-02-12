'use strict';

const Joi = require('joi');


// POST speech-to-text
module.exports.speechToText = {
    payload: Joi.binary().required()
};

// POST nlp
module.exports.nlp = {
    payload: Joi.object({
        text: Joi.string().required()
    })
};
