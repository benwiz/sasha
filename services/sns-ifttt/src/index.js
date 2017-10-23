const Https = require('https');
const Querystring = require('querystring');

// Display the contents of the index.html file
const handler = (event, context) => {
  context.succeed('yay!');
};

exports.handler = handler;
