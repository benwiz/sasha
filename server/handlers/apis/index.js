'use strict';

const SpeechToText = require('./lib/speech-to-text');
const NLP = require('./lib/nlp');
const textToSpeech = require('./lib/text-to-speech');

module.exports = {
    speechToText: SpeechToText.watson,
    nlp: NLP.luis,
    textToSpeech: textToSpeech.goolgeTranslate
};
