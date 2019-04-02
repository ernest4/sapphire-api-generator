"use strict";

const fs = require("fs");

module.exports = {
  apiDirCreator: function(app_name, version, dir) {
    try {
      const dirPath = `${app_name}/api/v${version}/${dir}`;
      fs.mkdirSync(dirPath, { recursive: true });
      return `  created: ${dirPath}`;
    } catch (err) {
      throw new Error(err);
    }
  },
  dirCreator: function(dirPath) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      return `  created: ${dirPath}`;
    } catch (err) {
      throw new Error(err);
    }
  }
};
