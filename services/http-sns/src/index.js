const SnsPublish = require('aws-sns-publish');

exports.handler = (event, context, callback) => {
  const queryString = event.queryStringParameters;
  const body = event.body;

  if (!queryString) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing query string!' }),
    };
    return callback(null, response);
  }
  if (!queryString.topic) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required query string parameter `topic`!' }),
    };
    return callback(null, response);
  }

  const params = { arn: 'arn:aws:sns:us-east-1:778257796245:%s' % queryString.topic };
  const data = JSON.stringify(body);
  SnsPublish(data, params).then((messageId) => {
    console.log('messageId:', messageId);
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };
  return callback(null, response);
};
