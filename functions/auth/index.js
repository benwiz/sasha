const Promise = require('bluebird');

module.exports.handle = (event, context, callback) => Promise.resolve(event)
  .then(() => console.log(JSON.stringify(event)))
  .then(() => callback(null, {
    statusCode: 302,
    headers: {
      Location: 'https://sasha.benwiz.io',
      Authorization: '999',
    },
  }))
  .catch(callback);
