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
                console.log('CCC');
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

        resolve({fact: 'not yet implemented'});
        // const endpoint = ``;
        // Request(endpoint, (error, response, body) => {
        //
        //     if (error || response.statusCode !== 200) {
        //         console.log('fact', 'error', error);
        //         reply(error); // TODO: reply 500 instead
        //     }
        //
        //     resolve(body);
        // });
    });
};

module.exports = {
    joke: joke,
    fact: fact
};
