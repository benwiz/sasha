const fs = require('fs');

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

exports.handler = (event, context) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    const replacements = {
      current_state: { salt_lamp: { state: 'on' } },
      desired_state: { salt_lamp: { state: 'on' } },
    };
    const html = replaceTemplates(replacements, data);
    context.succeed(html);
  });
};
