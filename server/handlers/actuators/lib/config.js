'use strict';

let config = {};

config.watson_username = process.env.WATSON_USERNAME;
config.watson_password = process.env.WATSON_PASSWORD;
config.mopidy_host = process.env.MOPIDY_HOST;

const get = (key) => {

    return config[key];
};

const set = (key, value) => {

    config[key] = value;
};

module.exports = {
    get: get,
    set: set
};
