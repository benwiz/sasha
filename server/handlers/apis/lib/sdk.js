'use strict';

// external libraries
const Promise = require('bluebird');
const Request = require('request');

// TODO: this should be in a configuration file
const sasha_api_url = 'http://localhost:8080';


// POST /speech-to-text
const speechToText = (binary) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/speech-to-text',
            headers: {'Content-Type': 'application/octet-stream'},
            body: binary
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            console.log(body);
            resolve(body);
        });
    });
};

// POST /nlp
const nlp = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/nlp',
            body: JSON.stringify(options)
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
};

// POST /play/next
const playNext = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/play/next',
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};

// POST /play/spotify
const playSpotify = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/play/spotify',
            body: JSON.stringify(options),
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
};

module.exports = {
    speechToText: speechToText,
    nlp: nlp,
    playNext: playNext,
    playSpotify: playSpotify,
};
