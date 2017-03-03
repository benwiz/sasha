'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('../actuators/index');
const IntentHandler = require('./lib/intent-handler');


// TODO: These functions will eventually no longer be HTTP handlers. Instead they will be normal functions that are called by a message queue listener.
// The idea is that this "forebrain" subscribes to the most updated state of the world. Then makes decisions off of that.

const text = (request, reply) => {

    textHandler(request.payload)
        .then((res) => {

            console.log('text res:', res);
        })
        .catch((err) => {

            console.log('text err:', err);
        });

    reply();
};

const audio = (request, reply) => {

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

    reply();
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

                console.log(res);
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
