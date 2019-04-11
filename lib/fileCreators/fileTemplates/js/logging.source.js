"use strict";

exports.loggingSource = () => `"use strict";

exports.logRequest = (req, res, next) => {
  const { method, url, body, user } = req;
  console.log(\`
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
- Request endpoint: \${method} \${url}

- Request at: \${new Date()}

- Request body:
\`);
  console.log(body);
  console.log(\`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\`);
  next();
};
`;
