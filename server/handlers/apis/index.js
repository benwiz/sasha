'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('./lib/sdk');
const IntentHandler = require('./lib/intent-handler');

// TODO: this should be in a configuration file
const sasha_api_url = 'http://localhost:8080';


const text = (request, reply) => {

    textHandler(request.payload)
        .then((res) => {

            reply(res);
        })
        .catch((err) => {

            console.log(err);
            reply(500); // TODO: use boom
        });
};

const audio = (request, reply) => {

    // post to sasha-api /speech-to-text
    SDK.speechToText(request.payload)
        .then((res) => {

            return textHandler(res);
        })
        .then((res) => {

            reply(res);
        })
        .catch((err) => {

            console.log(err);
            reply(500); // TODO: use boom
        });
};

const image = (request, reply) => {

    reply('image handling not implemented');
};

const video = (request, reply) => {

    reply('video handling not implemented');
};

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
