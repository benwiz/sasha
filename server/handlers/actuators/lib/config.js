'use strict';

let config = {};

config.watson_username = process.env.WATSON_USERNAME;
config.watson_password = process.env.WATSON_PASSWORD;
config.mopidy_host = process.env.MOPIDY_HOST;

module.exports = config;
