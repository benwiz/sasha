'use strict';

const Handler = require('../../handlers/pages/index');

module.exports = [

    // expose static files
    {
        method: 'GET',
        path: '/public/{path*}',
        handler: {
            directory: {
                path: './public',
                listing: false,
                index: false
            }
        }
    },

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

    // mopidy
    {
        method: 'GET',
        path: '/mopidy',
        handler: Handler.mopidy
    },
];
