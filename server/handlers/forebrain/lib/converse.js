'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const Actuators = require('../../actuators/index');


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

        Actuators.tellJoke(options)
            .then((res) => {

                return Actuators.textToSpeech({text: res.joke});
            })
            .then((res) => {

                return Actuators.playUrl({url: res.url});
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

        Actuators.tellFact(options)
            .then((res) => {

                return Actuators.textToSpeech({text: res.fact});
            })
            .then((res) => {

                return Actuators.playUrl({url: res.url});
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
