"use strict";

const fs = require("fs");

module.exports = {
  createApiDir: function(app_name, version, dir) {
    try {
      let dirPath = "";
      if (app_name) dirPath = `${app_name}/api/v${version}/${dir}`;
      else dirPath = `./api/v${version}/${dir}`;

      fs.mkdirSync(dirPath, { recursive: true });
      return `  created: ${dirPath}`;
    } catch (err) {
      throw new Error(err);
    }
  },
  createDir: function(dirPath) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      return `  created: ${dirPath}`;
    } catch (err) {
      throw new Error(err);
    }
  }
};
