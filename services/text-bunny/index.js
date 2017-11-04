const SnsPublish = require('aws-sns-publish');

exports.handle = (event, context, callback) => {
  console.log('event:', event);
  if (!event.phone) {
    return callback('Missing event variable for `phone`.');
  }
  if (!event.message) {
    return callback('Missing event variable for `message`.');
  }

  const message = event.message;
  const params = { phone: event.phone };
  SnsPublish(message, params)
    .then((messageId) => {
      console.log('messageId:', messageId);
      callback(null, { message: 'success' });
    })
    .catch((err) => {
      console.log(err);
      callback(null, { message: 'success' });
    });

  return 0;
};
