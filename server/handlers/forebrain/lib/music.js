'use strict';

// external libs
const Promise = require('bluebird');
const WtoN = require('words-to-num');
// internal libs
const Actuators = require('../../actuators/index');

const playMusicHandler = (options) => {

    console.log('options:', options);
    return new Promise((resolve, reject) => {

        const subintent = options.intent.split('.')[1];

        if (subintent === 'play') {

            if (options.song || options.artist || options.playlist) {
                const payload = {
                    song: options.song,
                    artist: options.artist,
                    playlist: options.playlist
                };
                Actuators.playSpotify(payload)
                    .then((res) => {

                        console.log(res);
                        resolve(res);
                    })
                    .catch((err) => {

                        reject(err);
                    });
            } else {
                Actuators.playPlay()
                    .then((res) => {

                        console.log(res);
                        resolve(res);
                    })
                    .catch((err) => {

                        reject(err);
                    });
            }

        } else if (subintent === 'pause') {

            Actuators.playPause()
                .then((res) => {

                    resolve();
                })
                .catch((err) => {

                    reject(err);
                });

        } else if (subintent === 'next') {

            Actuators.playNext()
                .then((res) => {

                    console.log();
                    resolve();
                })
                .catch((err) => {

                    reject(err);
                });

        } else if (subintent === 'volume') {

            console.log('vol', options);
            const payload = {
                volume: WtoN.convert(options.volume)
            };
            Actuators.playVolume(payload)
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
    playMusicHandler: playMusicHandler
};
