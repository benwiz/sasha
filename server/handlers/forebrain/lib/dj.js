'use strict';

const start = () => {

    console.log('hello, it\'s me the dj');

    return new Promise((resolve, reject) => {

        resolve('abc');
    });
};

module.exports = { start };
