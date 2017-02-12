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

// POST /play/spotify
module.exports.playSpotify = {
    payload: Joi.object({
        song: Joi.string().optional(),
        artist: Joi.string().optional(),
        playlist: Joi.string().optional()
    })
};

// POST /play/audiobuffer
module.exports.playBuffer = {
    payload: Joi.binary().required()
};

// POST /play/url
module.exports.playUrl = {
    payload: Joi.object({
        url: Joi.string().required() // TODO: validate true uri/url
    })
}
