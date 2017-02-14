'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const IntentHandler = require('./lib/intent-handler');

// TODO: this should be in a configuration file
const sasha_api_url = 'http://localhost:8080';


const text = (request, reply) => {

    textHandler(request.payload)
        .then((res) => {

            reply(res);
        })
        .catch((err) => {

            reply(err);
        });
};

const audio = (request, reply) => {

    // post to sasha-api /speech-to-text
    Request.post({
        url: sasha_api_url + '/speech-to-text',
        headers: {'Content-Type': 'application/octet-stream'},
        body: request.payload,
    }, (error, response, body) => {

        if (error) {
            console.log(error);
            reply(error);
        }

        console.log(body);
        textHandler(body)
            .then((res) => {

                reply(res);
            })
            .catch((err) => {

                reply(err);
            });
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
        Request.post({
            url: sasha_api_url + '/nlp',
            body: JSON.stringify({'text': text})
        }, (error, response, body) => {

            if (error) {
                console.log(error);
                reject(error);
            }

            const parsed = JSON.parse(body);
            const handler = IntentHandler.selector(parsed.intent.split('.')[0]);
            const res = handler(parsed);
            resolve(res);
        });
    });
};

module.exports = {
    text: text,
    audio: audio,
    image: image,
    video: video
};
