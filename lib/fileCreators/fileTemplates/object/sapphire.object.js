"use strict";

exports.sapphireJSONObject = (app_name, options, sapphireVersion) => ({
  sapphireVersion,
  appName: app_name,
  inline: !!options.inline,
  apiVersions: [options.apiv]
});
