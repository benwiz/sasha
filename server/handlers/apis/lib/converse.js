'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('./sdk');


const handler = (options) => {

    console.log('options:', options);
    return new Promise((resolve, reject) => {

        const subintent = options.intent.split('.')[1];

        if (subintent === 'joke') {
            return joke({/*subject: ''*/});
        } else if (subintent === 'fact') {
            return fact({/*subject: ''*/});
        } else {
            return unkown();
        }
    });
};

const unkown = () => {

    return new Promise((resolve, rejct) => {

        SDK.textToSpeech({text: 'I don\`t understand.'})
            .then((res) => {

                return SDK.playUrl({url: res.url});
            })
            .then((res) => {

                resolve(res);
            })
            .catch((err) => {

                reject(err);
            });
    });
};

const joke = (options) => {

    return new Promise((resolve, rejct) => {

        SDK.tellJoke(options)
            .then((res) => {

                return SDK.textToSpeech({text: res.joke});
            })
            .then((res) => {

                return SDK.playUrl({url: res.url});
            })
            .then((res) => {

                resolve(res);
            })
            .catch((err) => {

                reject(err);
            });
    });
};

const fact = (options) => {

    return new Promise((resolve, rejct) => {

        SDK.tellFact(options)
            .then((res) => {

                return SDK.textToSpeech({text: res.fact});
            })
            .then((res) => {

                return SDK.playUrl({url: res.url});
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
    handler: handler
};
