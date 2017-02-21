'use strict';

// external libs
const Promise = require('bluebird');
// internal libs
const Music = require('./music');
const Converse = require('./converse');


const selector = (intent) => {

    if (intent === 'music') {
        return Music.playMusicHandler;

    } else if (intent === 'converse') {
        return Converse.handler;

    } else {
        return genericHandler;
    }
};

const genericHandler = (options) => {

    return 'generic handler';
};

module.exports = {
    selector: selector
};
