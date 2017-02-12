'use strict';

// external libraries
const Request = require('request');


const joke = (request, reply) => {

    const endpoint = `http://tambal.azurewebsites.net/joke/random`;
    Request(endpoint, (error, response, body) => {

        if (error || response.statusCode !== 200) {
            console.log('joke', 'error', error);
            reply(error); // TODO: reply 500 instead
        }

        const parsed_body = JSON.parse(body);
        reply(parsed_body.joke);
    });
};

const fact = (request, reply) => {

    reply('not yet implemented');
    // const endpoint = ``;
    // Request(endpoint, (error, response, body) => {
    //
    //     if (error || response.statusCode !== 200) {
    //         console.log('fact', 'error', error);
    //         reply(error); // TODO: reply 500 instead
    //     }
    //
    //     reply(body);
    // });
};

module.exports = {
    joke: joke,
    fact: fact
};
