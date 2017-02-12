'use strict';

const Joi = require('joi');


// POST /text
module.exports.text = {
    payload: Joi.object({
        text: Joi.string().required()
    })
};

// POST /audio
module.exports.audio = {
    payload: Joi.binary().required()
};

// POST /image
module.exports.image = {
    payload: Joi.binary().required()
};

// POST /video
module.exports.video = {
    payload: Joi.binary().required()
};
