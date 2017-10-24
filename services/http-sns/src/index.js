const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  /*
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
  */

  AWS.config.update({
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
  });

  const sns = new AWS.SNS();
  const params = {
    Message: 'wemo_light_1_off', /* required */
    // MessageAttributes: {
    //   '<String>': {
    //     DataType: 'STRING_VALUE', /* required */
    //     BinaryValue: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
    //     StringValue: 'STRING_VALUE'
    //   },
    //   /* '<String>': ... */
    // },
    // MessageStructure: 'STRING_VALUE',
    // PhoneNumber: 'STRING_VALUE',
    // Subject: 'STRING_VALUE',
    // TargetArn: 'STRING_VALUE',
    // TopicArn: 'STRING_VALUE',
  };
  sns.publish(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };
  return callback(null, response);
};
