"use strict";

exports.serverSource = (appName, options, changes) => {
  try {
    const serverSourceString = fs.readFileSync(`${appName}/server.js`);

    let searchExpression;
    changes.forEach(change => {
      searchExpression = new RegExp(change.prev);
      insertExpression = change.new;
      serverSourceString = serverSourceString.replace(searchExpression, insertExpression);
    });
  } catch (err) {
    throw new Error(err);
  }
};
