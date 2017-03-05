'use strict';

// external libs
// internal libs
const Forebrain = require('../forebrain/index');


const text = (request, reply) => {

    Forebrain.text(request.payload);
    reply();
};

const audio = (request, reply) => {

    Forebrain.audio(request.payload);
    reply();
};

const image = (request, reply) => {

    reply('image handling not implemented');
};

const video = (request, reply) => {

    reply('video handling not implemented');
};

module.exports = {
    text: text,
    audio: audio,
    image: image,
    video: video
};
