'use strict';

// NOTE: this will probably be split up into many files inside this lib/ folder


const selector = (intent) => {

    if (intent === 'music') {
        return playMusicHandler;
    } else {
        return genericHandler;
    }
};

const genericHandler = (options) => {

    return 'generic handler';
};

const playMusicHandler = (options) => {

    return 'music handler';
};

module.exports = {
    selector: selector
};
