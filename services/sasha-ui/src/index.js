const fs = require('fs');

exports.handler = (event, context) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    context.succeed(data);
  });
};
