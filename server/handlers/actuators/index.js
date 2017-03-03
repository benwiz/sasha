'use strict';

// external libraries
const Promise = require('bluebird');
const Request = require('request');
// internal libraries
const Converse = require('./lib/converse');
const NLP = require('./lib/nlp');
const SpeechToText = require('./lib/speech-to-text');
const TextToSpeech = require('./lib/text-to-speech');

// TODO: this should be in a configuration file
const sasha_api_url = 'http://localhost:8080';

// TODO: this is not the SDK but actually the actuators.

// POST /speech-to-text
const speechToText = (binary) => {

    return SpeechToText.watson(binary);
};

// POST /nlp
const nlp = (options) => {

    return NLP.luis(options);
};

// POST /text-to-speech
const textToSpeech = (options) => {

    return textToSpeech.googleTranslate(options);
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

// POST /play/url
const playUrl = (options) => {

    return new Promise((resolve, reject) => {

        Request.post({
            url: sasha_api_url + '/play/url',
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

    return Converse.joke(options);
};

// POST /tell/fact
const tellFact = (options) => {

    return Converse.fact(options);
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
    playUrl: playUrl,
    tellJoke: tellJoke,
    tellFact: tellFact
};
