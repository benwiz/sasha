'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const Actuators = require('../actuators/index');
const IntentHandler = require('./lib/intent-handler');


// TODO: These functions will eventually no longer be HTTP handlers. Instead they will be normal functions that are called by a message queue listener.

// The idea is that this Forebrain subscribes to the most updated state of the world. Then makes decisions off of that and hits the Actuators

// For senses to reach Sasha, either the sensors will have to http post (like they do now) to SenseReceivers (http endpoint) which will pass it the Hindbrain (handlers) which will update the state of the world and publish it.

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
    Actuators.speechToText(request.payload)
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
        Actuators.nlp(options)
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
