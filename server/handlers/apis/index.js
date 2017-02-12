'use strict';


const text = (request, reply) => {

    reply('text');
};

const audio = (request, reply) => {

    reply('audio');
};

const image = (request, reply) => {

    reply('image handling not implemented');
};

const video = (request, reply) => {

    reply('video handling not implemented');
}


module.exports = {
    text: text,
    audio: audio,
    image: image,
    video: video
};
