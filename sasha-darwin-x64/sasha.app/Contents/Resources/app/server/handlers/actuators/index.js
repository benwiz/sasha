'use strict';

// external libraries
const Promise = require('bluebird');
const Request = require('request');
// internal libraries
const Converse = require('./lib/converse');
const NLP = require('./lib/nlp');
const SpeechToText = require('./lib/speech-to-text');
const TextToSpeech = require('./lib/text-to-speech');
const Mopidy = require('./lib/mopidy');

// TODO: this should be in a configuration file
const sasha_api_url = 'http://localhost:8080';

// TODO: this is not the Actuators but actually the actuators.

// POST /speech-to-text
const speechToText = (binary) => {

    return SpeechToText.watson(binary);
};

// POST /nlp
const nlp = (options) => {

    return NLP.luis(options);
};

// POST /text-to-speech
const textToSpeech = (options) => {

    return TextToSpeech.googleTranslate(options);
};

// POST /play/play
const playPlay = (options) => {

    return Mopidy.play(options);
};

// POST /play/pause
const playPause = (options) => {

    return Mopidy.pause(options);
};

// POST /play/next
const playNext = (options) => {

    return Mopidy.next(options);
};

// POST /play/volume
const playVolume = (options) => {

    return Mopidy.setVolume(options);
};

// POST /play/spotify
const playSpotify = (options) => {

    return Mopidy.spotify(options);
};

// POST /play/url
const playUrl = (options) => {

    return Mopidy.url(options);
};

// POST /tell/joke
const tellJoke = (options) => {

    return Converse.joke(options);
};

// POST /tell/fact
const tellFact = (options) => {

    return Converse.fact(options);
};


module.exports = {
    speechToText: speechToText,
    textToSpeech: textToSpeech,
    nlp: nlp,
    playPlay: playPlay,
    playPause: playPause,
    playNext: playNext,
    playVolume: playVolume,
    playSpotify: playSpotify,
    playUrl: playUrl,
    tellJoke: tellJoke,
    tellFact: tellFact
};
