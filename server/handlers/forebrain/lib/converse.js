'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('../../actuators/index');


const handler = (options) => {

    console.log('options:', options);

    const subintent = options.intent.split('.')[1];

    if (subintent === 'joke') {
        return joke({/*subject: ''*/});
    } else if (subintent === 'fact') {
        return fact({/*subject: ''*/});
    }
};

const joke = (options) => {

    return new Promise((resolve, reject) => {

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

    return new Promise((resolve, reject) => {

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
