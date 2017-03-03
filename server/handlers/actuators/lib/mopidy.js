'use strict';

// external libraries
const Mopidy = require('mopidy');
const Request = require('request');
const Streamifier = require('streamifier');

// TODO: come up with a real resolve

const mopidy = new Mopidy({
    webSocketUrl: `ws://192.168.1.10:6680/mopidy/ws/`,
    callingConvention: 'by-position-or-by-name'
});

const play = (options) => {

    return new Promise((resolve, reject) => {

        console.log('play song');
        mopidy.playback.play()
            .then((res) => {

                console.log(res);
                resolve();
            })
            .catch((err) => {

                console.log('error:', err);
                resolve(err);
            });
    });
};

const pause = (options) => {

    return new Promise((resolve, reject) => {

        console.log('pause song');
        mopidy.playback.pause()
            .then((res) => {

                resolve();
            })
            .catch((err) => {

                console.log('error:', err);
                resolve(err);
            });
    });
};

const next = (options) => {

    return new Promise((resolve, reject) => {

        console.log('next song');
        mopidy.playback.next()
            .then((res) => {

                resolve();
            })
            .catch((err) => {

                console.log('error:', err);
                resolve(err);
            });
    });
};

const getVolume = (options) => {

    return new Promise((resolve, reject) => {

        mopidy.mixer.getVolume({})
            .then((res) => {

                console.log(res);
                resolve(res);
            })
            .catch((err) => {

                console.log('error:', err);
                reject(err);
            });
    });
}

const setVolume = (options) => {

    return new Promise((resolve, reject) => {

        console.log('set vol:', options.volume);
        mopidy.mixer.setVolume({'volume': options.volume})
            .then((res) => {

                console.log(res);
                resolve(res);
            })
            .catch((err) => {

                console.log('error:', err);
                reject(err);
            });
    });
};

const spotify = (options) => {

    return new Promise((resolve, reject) => {

        const artist = options.artist;
        const song = options.song;
        const playlist = options.playlist;

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
                resolve(JSON.stringify(data[0]));
            })
            .catch((err) => {

                console.log('error:', err);
                reject(err);
            });
    });
};

const url = (options) => {

    return new Promise((resolve, reject) => {

        mopidy.tracklist.clear({})
            .then(() => {

                return mopidy.tracklist.add({uri: options.url});
            })
            .then((data) => {

                mopidy.playback.play({'tlid': data[0].tlid});
                resolve({status: 'playing'});
            })
            .catch((err) => {

                reject(err);
            });
    });
};

const buffer = (options) => {

    resolve('not yet implemented');
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
