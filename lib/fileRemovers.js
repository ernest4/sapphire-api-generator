"user strict";

const { exec } = require("child_process");

exports.deleteAssetFilesSync = (asset, options) => {
  let apiDirs = ["controllers", "models", "routes", "services"];
  const testDirs = ["custom", "generated"];

  let statusString = "";

  // apiDirs.push(inline ? "models" : `models/${asset}`);

  apiDirs.forEach(dir => {
    exec(`rm -rf ./api/v${options.apiv}/${dir}/${asset}*`, (err, stdout, stderr) => {
      if (err) return;
      console.log(`     deleted ${asset} from ./api/v${options.apiv}/${dir}`);
    });
  });

  testDirs.forEach(dir => {
    exec(`rm -rf ./tests/integration/v${options.apiv}/${dir}/${asset}*`, (err, stdout, stderr) => {
      if (err) return;
      console.log(`     deleted ${asset} from ./tests/integration/v${options.apiv}/${dir}`);
    });
  });

  return statusString;
};
