'use strict';

// External libraries
const Promise = require('bluebird');
const Request = require('request');

// Host
let host;

// GET /api/state
const getState = () => {

    return new Promise((resolve, reject) => {

        Request.get({
            headers: {'content-type': 'application/json'},
            url: host + '/api/state'
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }

            const obj = JSON.parse(body);
            resolve(obj);
        });
    });
};

// TODO: Update state


// Test
host = 'http://localhost:8000'
getState().then(console.log).catch(console.log);
