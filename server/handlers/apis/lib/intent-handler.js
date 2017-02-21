'use strict';

// external libs
const Promise = require('bluebird');
// internal libs
const Fallback = require('./fallback');
const Music = require('./music');
const Converse = require('./converse');


const selector = (intent) => {

    if (intent === 'music') {
        return Music.playMusicHandler;

    } else if (intent === 'converse') {
        return Converse.handler;

    } else {
        return Fallback.handler;
    }
};

module.exports = {
    selector: selector
};
