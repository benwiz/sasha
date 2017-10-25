const SnsPublish = require('aws-sns-publish');

exports.handler = (event, context, callback) => {

  if (!process.env.PHONE) {
    return callback('Missing environment variable for PHONE.');
  }

  const message = ' 🐰🐰🐰🐰🐰🐰🐰\n🐰 Good morning! 🐰\n 🐰🐰🐰🐰🐰🐰🐰';
  const params = { phone: process.env.PHONE };
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
