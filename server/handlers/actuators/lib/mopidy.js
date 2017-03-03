'use strict';

// external libraries
const Mopidy = require('mopidy');
const Request = require('request');
const Streamifier = require('streamifier');

// TODO: come up with a real reply

const mopidy = new Mopidy({
    webSocketUrl: `ws://192.168.1.10:6680/mopidy/ws/`,
    callingConvention: 'by-position-or-by-name'
});

const play = (request, reply) => {

    console.log('play song');
    mopidy.playback.play()
        .then((res) => {

            console.log(res);
            reply();
        })
        .catch((err) => {

            console.log('error:', err);
            reply(err);
        });
};

const pause = (request, reply) => {

    console.log('pause song');
    mopidy.playback.pause()
        .then((res) => {

            reply();
        })
        .catch((err) => {

            console.log('error:', err);
            reply(err);
        });
};

const next = (request, reply) => {

    console.log('next song');
    mopidy.playback.next()
        .then((res) => {

            reply();
        })
        .catch((err) => {

            console.log('error:', err);
            reply(err);
        });
};

const getVolume = (request, reply) => {

    mopidy.mixer.getVolume({})
        .then((res) => {

            console.log(res);
            reply(res);
        })
        .catch((err) => {

            console.log('error:', err);
            reply(err);
        });
}

const setVolume = (request, reply) => {

    console.log('set vol:', request.payload.volume);
    mopidy.mixer.setVolume({'volume': request.payload.volume})
        .then((res) => {

            console.log(res);
            reply(res);
        })
        .catch((err) => {

            console.log('error:', err);
            reply(err);
        });
};

const spotify = (request, reply) => {

    const artist = request.payload.artist;
    const song = request.payload.song;
    const playlist = request.payload.playlist;

    let top_track = null;
    const query = {};
    if (artist) query.artist = [artist];
    if (song) query.track_name = [song];
    // if (playlist) query.any = [playlist + ' playlist'];
    console.log('query:', query);

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
            reply({status: 'playing'});
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
    play: play,
    pause: pause,
    next: next,
    getVolume: getVolume,
    setVolume: setVolume,
    spotify: spotify,
    url: url,
    buffer: buffer
};
