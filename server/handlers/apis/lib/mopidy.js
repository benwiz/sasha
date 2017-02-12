'use strict';

// external libraries
const Mopidy = require('mopidy');
const Request = require('request');
const Streamifier = require('streamifier');

// TODO: come up with a real reply

const mopidy = new Mopidy({
    webSocketUrl: `ws://192.168.1.15:6680/mopidy/ws/`,
    callingConvention: 'by-position-or-by-name'
});

const spotify = (request, reply) => {

    const artist = request.payload.artist;
    const song = request.payload.song;
    // const playlist = request.payload.playlist;

    let top_track = null;
    const query = {
        artist: [artist],
        track_name: [song]
    };

    mopidy.library.search({'query': query, 'uris': ['spotify:']})
        .then((data) => {

            console.log('search results:', data);
            top_track = data[0].tracks[0];
            return top_track;
        })
        .then(() => {

            return mopidy.tracklist.clear({});
        })
        .then(() => {

            const add_options = {
                tracks: [top_track]
                // at_position: null,
                // uri: null,
                // uris: null
            };
            return mopidy.tracklist.add(add_options);
        })
        .then((data) => {

            console.log('added to tracklist:', data[0]);
            mopidy.playback.play({'tlid': data[0].tlid});
            reply(JSON.stringify(data[0]));
        })
        .catch((err) => {
            console.log('error:', err);
            reject(err);
        });
};

const url = (request, reply) => {

    mopidy.tracklist.clear({})
        .then(() => {

            return mopidy.tracklist.add({uri: request.payload.url});
        })
        .then((data) => {

            mopidy.playback.play({'tlid': data[0].tlid});
            reply('playing');
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
