'use strict';

// external libraries
const Promise = require('bluebird');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const Streamifier = require('streamifier');
// internal libraries
const Private = require('./private'); // TODO: switch to env vars

// TODO: look into session based websocket approach to watson speech api

const WatsonSTT = new SpeechToTextV1({
    username: Private.username,
    password: Private.password
});

const watson = (request, reply) => {

    const params = {
        audio: Streamifier.createReadStream(request.payload),
        content_type: 'audio/l16; rate=16000',
        customization_id: '77148170-ece4-11e6-ba16-9d7ea578c8c5'
    };

    WatsonSTT.recognize(params, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(res, null, 2));
            const result = res.results[res.result_index].alternatives[0].transcript;
            reply(result);
        }
    });

    // const chunks = [];
    // Streamifier.createReadStream(request.payload)
    //     .pipe(speech_to_text.createRecognizeStream(params))
    //     .on('data', (chunk) => {
    //
    //         console.log('chunk', chunk);
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
    //         reply(new_msg);
    //     });
};

module.exports = {
    watson: watson
};
