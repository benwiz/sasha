'use strict';

const Pages = require('./pages/index');
const Api = require('./lib/api');
const Sensors = require('./lib/sensors');

module.exports = Pages.concat(Api).concat(Sensors);
