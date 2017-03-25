'use strict';

const Handler = require('../../handlers/pages/index');

module.exports = [

    // index
    {
        method: 'GET',
        path: '/',
        handler: Handler.index
    },

    // config
    {
        method: 'GET',
        path: '/config',
        handler: Handler.config
    },

    // text
    {
        method: 'GET',
        path: '/text',
        handler: Handler.text
    },

    // speak
    {
        method: 'GET',
        path: '/speak',
        handler: Handler.speak
    },

    // logs
    {
        method: 'GET',
        path: '/logs',
        handler: Handler.logs
    },
];
