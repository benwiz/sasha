'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const Actuators = require('../actuators/index');
const IntentHandler = require('./lib/intent-handler');


// TODO: These functions will be called not by the Sensors but instead by a part of the forebrain that reads the most up-to-date State of the World

const text = (options) => {

    textHandler(options)
        .then((res) => {

            console.log('text res:', res);
        })
        .catch((err) => {

            console.log('text err:', err);
        });
};

const audio = (options) => {

    // post to sasha-api /speech-to-text
    Actuators.speechToText(options)
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

const image = (options) => {

};

const video = (options) => {

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

                console.log(res);
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
