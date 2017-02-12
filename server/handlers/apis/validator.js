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

// POST text-to-speech
module.exports.textToSpeech = {
    payload: Joi.object({
        text: Joi.string().required()
    })
};

// GET joke
module.exports.joke = {
    // params: Joi.object({
    //
    // })
};

// GET fact
module.exports.fact = {
    // params: Joi.object({
    //
    // })
};
