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

// POST /text-to-speech
const textToSpeech = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/text-to-speech',
            body: JSON.stringify(options)
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
};

// POST /play/play
const playPlay = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/play/play',
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};

// POST /play/pause
const playPause = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/play/pause',
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve();
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

// POST /play/volume
const playVolume = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/play/volume',
            body: JSON.stringify(options),
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve(JSON.parse(body));
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

// POST /tell/joke
const tellJoke = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/tell/joke/' + options.subject,
            body: JSON.stringify(options)
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
};

// POST /tell/fact
const tellFact = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/tell/fact/' + options.subject,
            body: JSON.stringify(options)
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
    textToSpeech: textToSpeech,
    nlp: nlp,
    playPlay: playPlay,
    playPause: playPause,
    playNext: playNext,
    playVolume: playVolume,
    playSpotify: playSpotify,
    tellJoke: tellJoke,
    tellFact: tellFact
};
