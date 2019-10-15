"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsheetsprocessor = _interopRequireDefault(require("./gsheetsprocessor.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reader = function reader(options, callback) {
  (0, _gsheetsprocessor.default)(options, function (results) {
    callback(results);
  });
};

module.exports = reader;
var _default = reader;
exports.default = _default;