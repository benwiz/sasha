'use strict';

// external libraries
const Mopidy = require('mopidy');
const Request = require('request');
const Streamifier = require('streamifier');
// internal libraries
const Config = require('./config');

console.log('hey');

const mopidy = new Mopidy({
    webSocketUrl: `ws://${Config.get('mopidy_host')}:6680/mopidy/ws/`,
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

                resolve(res);
            })
            .catch((err) => {

                reject(err);
            });
    });
};

const spotify = (options) => {

    return new Promise((resolve, reject) => {

        const artist = options.artist;
        const song = options.song;
        const playlist = options.playlist;

        if (playlist) {

            mopidy.tracklist.clear({})
                .then(() => {

                    return mopidy.playlists.filter({'criteria':{name:playlist}});
                })
                .then((data) => {

                    const add_options = {
                        tracks: data[0].tracks
                    };
                    return mopidy.tracklist.add(add_options);
                })
                .then(() => {

                    return mopidy.tracklist.shuffle();
                })
                .then(() => {

                    mopidy.playback.play();
                    resolve({playlist: playlist});
                })
                .catch((err) => {

                    reject(err);
                });

        } else {
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

                    mopidy.playback.play({'tlid': data[0].tlid});
                    resolve(JSON.stringify(data[0]));
                })
                .catch((err) => {

                    reject(err);
                });
        }
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
    mopidy: mopidy,
    play: play,
    pause: pause,
    next: next,
    getVolume: getVolume,
    setVolume: setVolume,
    spotify: spotify,
    url: url,
    buffer: buffer
};
