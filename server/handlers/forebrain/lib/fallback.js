'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const SDK = require('./sdk');


const handler = (options) => {

    return new Promise((resolve, rejct) => {

        SDK.textToSpeech({text: `I don't understand.`})
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
