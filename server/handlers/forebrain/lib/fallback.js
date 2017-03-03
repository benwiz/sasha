'use strict';

// external libs
const Promise = require('bluebird');
const Request = require('request');
// internal libs
const Actuators = require('../../actuators/index');


const handler = (options) => {

    return new Promise((resolve, reject) => {

        Actuators.textToSpeech({text: `I don't understand.`})
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
