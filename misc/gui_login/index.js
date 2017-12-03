const Promise = require('bluebird');

module.exports.handle = (event, context, callback) => Promise.resolve(event)
  .then(() => console.log(JSON.stringify(event)))
  .then(() => callback(null, {
    statusCode: 301,
    headers: {
      Location: 'https://sasha.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=5nak3f7i74nijenes3ec3un9bg&redirect_uri=https://sasha.benwiz.io/login/auth',
    },
  }))
  .catch(callback);
