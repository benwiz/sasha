const Promise = require('bluebird');
const Request = require('request');
const fs = require('fs');

// Replace jinja style double bracket templates in a string. Replacements will also convert data
// a string if necessary.
const replaceTemplates = (replacements, html) => {
  let result = html;
  Object.keys(replacements).forEach((key) => {
    let replacement = replacements[key];
    if (typeof replacement === 'object') {
      replacement = JSON.stringify(replacement);
    }
    result = result.replace(`{{ ${key} }}`, replacement);
  });
  return result;
};

// Get the current coordinates from DynamoDB via the API.
const getCoordinates = person => new Promise((resolve, reject) => {
  Request.get({
    headers: { 'content-type': 'application/json' },
    url: `https://sasha.benwiz.io/dynamo/people?person=${person}`,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    console.log('getCoordinates() raw response:', body);
    const obj = JSON.parse(body);
    const reply = {
      latitude: obj.latitude,
      longitude: obj.longitude,
      timestamp: obj.latest_coords_timestamp,
    };
    return resolve(reply);
  });
});

// Display the contents of the index.html file
exports.handle = (event, context, callback) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    getCoordinates('benwisialowski')
      .then((res) => {
        const replacements = {
          latitude: res.latitude,
          longitude: res.longitude,
          timestamp: res.timestamp,
        };
        const html = replaceTemplates(replacements, data);
        context.succeed(html); // TODO: use callback instead
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });
};
