'use strict';

const SpeechToText = require('./lib/speech-to-text');
const NLP = require('./lib/nlp');

module.exports = {
    speechToText: SpeechToText.watson,
    nlp: NLP.luis
};
