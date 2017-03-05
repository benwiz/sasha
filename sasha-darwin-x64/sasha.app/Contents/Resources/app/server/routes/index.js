'use strict';

const Pages = require('./pages/index');
const Api = require('./lib/api');
const Forebrain = require('./lib/forebrain');

module.exports = Pages.concat(Api).concat(Forebrain);
