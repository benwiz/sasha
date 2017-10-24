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

// Display the contents of the index.html file
const displayView = (event, context, callback) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    const replacements = {
      current_state: { salt_lamp: { state: 'on' } },
      desired_state: { salt_lamp: { state: 'on' } },
    };
    const html = replaceTemplates(replacements, data);
    context.succeed(html); // TODO: use callback instead
  });
};

exports.handler = displayView;
