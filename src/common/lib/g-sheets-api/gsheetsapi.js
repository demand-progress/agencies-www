"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var gsheetsAPI = function gsheetsAPI(sheetId) {
  try {
    var sheetsUrl = "https://spreadsheets.google.com/feeds/cells/".concat(sheetId, "/public/values?alt=json-in-script");
    return fetch(sheetsUrl).then(function (response) {
      if (!response.ok) {
        throw new Error('Error fetching sheet');
      }

      return response.text();
    }).then(function (resultText) {
      var formattedText = resultText.replace('gdata.io.handleScriptLoaded(', '').slice(0, -2);
      return JSON.parse(formattedText);
    });
  } catch (err) {
    console.log("gsheetsAPI error: ".concat(err));
    return {};
  }
};

var _default = gsheetsAPI;
exports.default = _default;