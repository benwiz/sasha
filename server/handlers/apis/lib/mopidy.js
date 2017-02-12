'use strict';

// external libraries
const Mopidy = require('mopidy');
const Request = require('request');
const Streamifier = require('streamifier');


const mopidy = new Mopidy({
    webSocketUrl: `ws://192.168.1.15:6680/mopidy/ws/`,
    callingConvention: 'by-position-or-by-name'
});

const spotify = (request, reply) => {

    reply('not yet implemented');å
};

const url = (request, reply) => {

    mopidy.tracklist.clear({})
        .then(() => {

            return mopidy.tracklist.add({uri: request.payload.url});
        })
        .then((data) => {

            mopidy.playback.play({'tlid': data[0].tlid});
            reply('good');
        })
        .catch((err) => {

            console.log('error:', err);
            reply(err); // TODO: reply 500 with boom
        });
};

const buffer = (request, reply) => {

    reply('not yet implemented');
};

module.exports = {
    spotify: spotify,
    url: url,
    buffer: buffer
};
