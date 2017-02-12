'use strict';

// external libs
const Request = require('request');
// internal libs
const IntentHandler = require('./lib/intent-handler');

const sasha_api_url = 'http://localhost:8080';

const text = (request, reply) => {

    // post to sasha-api /nlp
    Request.post({
        url: sasha_api_url + '/nlp',
        body: JSON.stringify(request.payload)
    }, (error, response, body) => {

        const handler = IntentHandler.selector(body.intent);
        console.log(handler);
        reply(body);
    });
};

const audio = (request, reply) => {

    // post to sasha-api /speech-to-text
    // then utilize same logic as text function above
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
