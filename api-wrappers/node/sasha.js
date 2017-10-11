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

// POST /api/state
const updateState = (body) => {

    return new Promise((resolve, reject) => {

        Request.post({
            headers: {'content-type': 'application/json'},
            url: host + '/api/state',
            body: JSON.stringify(body)
        }, (error, response, body) => {

            if (error) {
                reject(error);
            }

            const obj = JSON.parse(body);
            resolve(obj);
        });
    });
};


// Test
host = 'http://localhost:8000'
getState()
    .then((res) => {

        console.log('getState() result:\n', res);

        const body = {
            desired_state: res.desired_state
        };
        body.desired_state.salt_lamp.state = 1;
        return updateState(body);
    })
    .then((res) => {

        console.log('setState() result:\n', res);

        return getState();
    })
    .then((res) => {

        console.log('getState() result 2:\n', res);
    })
    .catch(console.log);

