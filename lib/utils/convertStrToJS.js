"use strict";

exports.convertStrToJavascript = string => {
  return new Function(`return ${string}`)();
};
