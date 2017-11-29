const Promise = require('bluebird');
const Request = require('request');


exports.handle = (event, context, callback) => {
  console.log('EVENT:', event);

  const reply = { message: 'LOL.' };
  return callback(null, reply);
};
