const Promise = require('bluebird');
const Request = require('request');


exports.handle = (event, context, callback) => {
  console.log('EVENT:', event);
  console.log('BODY:', event.body);

  if (!event.body) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing payload!' }),
    };
    return callback(null, response);
  }
  const reply = {
    statusCode: 500,
    body: JSON.stringify({ message: 'LOL.' }),
  };
  return callback(null, reply);
};
