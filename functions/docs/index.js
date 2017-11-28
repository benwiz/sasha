const SwaggerDocs = require('./swagger');
const fs = require('fs');

const swaggerDocsJson = JSON.stringify(SwaggerDocs);

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

// Display the contents of the index.html file
const displayView = (event, context, callback) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    const replacements = { SWAGGER_JSON: swaggerDocsJson };
    const html = replaceTemplates(replacements, data);
    console.log(html);
    context.succeed(html);
  });
};

exports.handle = (event, context, callback) => {
  displayView(event, context, callback);
};
