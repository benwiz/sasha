'use strict';

// external libs
const Promise = require('bluebird');
// internal libs
const SDK = require('./sdk');

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

    return new Promise((resolve, reject) => {

        const subintent = options.intent.split('.')[1];

        if (subintent === 'play') {

            const payload = {
                song: options.song,
                artist: options.artist,
                playlist: options.playlist
            };
            SDK.playSpotify(payload)
                .then((res) => {

                    console.log(res);
                    resolve(res);
                })
                .catch((err) => {

                    reject(err);
                });

        } else {

            resolve(`unknown subintent: ${subintent}`);

        }
    });
};

module.exports = {
    selector: selector
};
