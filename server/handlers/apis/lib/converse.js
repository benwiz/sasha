'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('./lib/sdk');


const handler = (options) => {

    console.log('options:', options);
    return new Promise((resolve, reject) => {

        const subintent = options.intent.split('.')[1];

        if (subintent === 'joke') {
            return joke(options);
        } else if (subintent === 'fact') {
            return fact(options);
        } else {
            return SDK.textToSpeech({text: 'I don\'t understand'});
        }
    });
};

const joke = (options) => {

    return new Promise((resolve, rejct) => {

        SDK.tellJoke(options)
            .then((res) => {

                return SDK.textToSpeech({text: res.joke});
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
