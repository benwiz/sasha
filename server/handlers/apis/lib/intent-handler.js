'use strict';

// external libs
const Promise = require('bluebird');
// internal libs
const Music = require('./music');


// NOTE: this will probably be split up into many files inside this lib/ folder


const selector = (intent) => {

    if (intent === 'music') {
        return Music.playMusicHandler;

    if (intent === 'converse')
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
