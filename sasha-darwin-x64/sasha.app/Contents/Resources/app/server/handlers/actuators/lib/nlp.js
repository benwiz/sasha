'use strict';

// external libraries
const Promise = require('bluebird');
const Request = require('request');
const _ = require('lodash');


const luis = (options) => {

    return new Promise((resolve, reject) => {

        const text = options.text;
        const endpoint = `https://api.projectoxford.ai/luis/v2.0/apps/ee139b14-77a8-49ab-b35d-26bc200f599c?subscription-key=7df77afddcab477a9a63a7b9c5e4f2c7&q=${text}`

        Request(endpoint, (error, response, body) => {

            if (error || response.statusCode !== 200) {
                reject(error);
            }

            const parsed_body = JSON.parse(body);

            let msg = {
                intent: parsed_body.topScoringIntent.intent
            };

            _.map(parsed_body.entities, (entity) => {

                console.log('intent:', msg.intent);
                switch (msg.intent) {

                    case 'music.play':
                        if (entity.type === 'song') {
                            msg.song = entity.entity;
                        } else if (entity.type === 'artist') {
                            msg.artist = entity.entity;
                        } else if (entity.type === 'playlist') {
                            msg.playlist = entity.entity;
                        }
                        break;

                    case 'music.volume':
                        msg.volume = entity.entity;

                    case 'misc.joke':
                        // add nothing to message
                        break;

                    case 'misc.fact':
                        msg.subject = entity.entity;
                        break;
                }
            });

            resolve(msg);
        });
    });
};

module.exports = {
    luis: luis
};
