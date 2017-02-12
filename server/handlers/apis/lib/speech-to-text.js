'use strict';

// external libraries
const Promise = require('bluebird');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const Fs = Promise.promisifyAll(require('fs'));
// internal libraries
const Private = require('./private'); // TODO: switch to env var

// TODO: look into session based websocket approach to watson speech api

const speech_to_text  = new SpeechToTextV1({
  username: Private.username,
  password: Private.password
});

const service = (request, reply) => {

    console.log(request.payload);
    reply('hey');
    // const params = {
    //     content_type: 'audio/l16; rate=16000',
    //     customization_id: '77148170-ece4-11e6-ba16-9d7ea578c8c5'
    // };
    //
    // const chunks = [];
    // audio_stream.pipe(speech_to_text.createRecognizeStream(params))
    //     .on('data', (chunk) => {
    //
    //         chunks.push(chunk.toString());
    //     })
    //     .on('end', () => {
    //
    //         console.log('transcription:', chunks.join(''), '\n');
    //         const new_msg = {
    //             type: 'text',
    //             text: chunks.join('')
    //         };
    //
    //         console.log('new_msg:', new_msg);
    //         resolve(new_msg);
    //     });
};

module.exports = {
    service: service
};
