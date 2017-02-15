'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('./lib/sdk');
const IntentHandler = require('./lib/intent-handler');


const text = (request, reply) => {

    reply();

    textHandler(request.payload)
        .then((res) => {

            console.log('text res:', res);
        })
        .catch((err) => {

            console.log('text err:', err);
        });
};

const audio = (request, reply) => {

    reply();

    // post to sasha-api /speech-to-text
    SDK.speechToText(request.payload)
        .then((res) => {

            return textHandler(res);
        })
        .then((res) => {

            console.log('audio res:', res);
        })
        .catch((err) => {

            console.log('audio err:', err);
        });
};

const image = (request, reply) => {

    reply('image handling not implemented');
};

const video = (request, reply) => {

    reply('video handling not implemented');
};

///////
///////

const textHandler = (text) => {

    return new Promise((resolve, reject) => {

        // post to sasha-api /nlp
        const options = {
            'text': text
        };
        SDK.nlp(options)
            .then((res) => {

                const handler = IntentHandler.selector(res.intent.split('.')[0]);
                return handler(res);
            })
            .then((res) => {

                resolve(res);
            })
            .catch((err) => {

                reject(err);
            });
    });
};

module.exports = {
    text: text,
    audio: audio,
    image: image,
    video: video
};
