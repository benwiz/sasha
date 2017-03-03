'use strict';

const Pages = require('./pages/index');
const Forebrain = require('./lib/forebrain');

module.exports = Pages.concat(Forebrain);
