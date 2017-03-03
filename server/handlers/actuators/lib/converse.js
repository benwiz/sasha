'use strict';

// external libraries
const Promise = require('bluebird');
const Request = require('request');


const joke = (options) => {

    return new Promise((resolve, reject) => {

        const subject = options.subject; // TODO: utilize subject
        const endpoint = `http://tambal.azurewebsites.net/joke/random`;
        Request(endpoint, (error, response, body) => {

            if (error || response.statusCode !== 200) {
                console.log('joke', 'error', error);
                reject(error);
            }

            const parsed_body = JSON.parse(body);
            resolve({joke: parsed_body.joke});
        });
    });
};

const fact = (options) => {

    return new Promise((resolve, reject) => {

        const subject = options.subject; // TODO: utilize subject
        const endpoint = `http://catfacts-api.appspot.com/api/facts`;
        Request(endpoint, (error, response, body) => {

            if (error || response.statusCode !== 200) {
                console.log('joke', 'error', error);
                reject(error);
            }

            const parsed_body = JSON.parse(body);
            resolve({fact: parsed_body.facts[0]});
        });
    });
};

module.exports = {
    joke: joke,
    fact: fact
};
