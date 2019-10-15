"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsheetsapi = _interopRequireDefault(require("./gsheetsapi.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchValues(valToMatch, valToMatchAgainst) {
  try {
    if (typeof valToMatch != 'undefined' && valToMatch.toLowerCase().trim() == valToMatchAgainst.toLowerCase().trim()) {
      return true;
    }
  } catch (e) {
    console.log("error in matchValues: ".concat(e.message));
    return false;
  }

  return false;
}

;

function filterResults(resultsToFilter, filter) {
  var filteredData = []; // now we have a list of rows, we can filter by various things

  return resultsToFilter.filter(function (item) {
    var addRow = false;

    if (typeof item === 'undefined' || item.length <= 0 || Object.keys(item).length <= 0) {
      return false;
    }

    Object.keys(filter).forEach(function (key) {
      var filterValue = filter[key]; // e.g. 'archaeology'

      var itemValue = item[key]; // e.g. 'department' or 'undefined'

      addRow = matchValues(itemValue, filterValue);
    });
    return addRow;
  });
}

function processGSheetResults(JSONResponse, returnAllResults, filter) {
  var data = JSONResponse.feed.entry;
  var startRow = 2; // skip the header row(1), don't need it

  var processedResults = [{}];
  var colNames = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      var cell = item['gs$cell']; // gets cell data

      var val = cell['$t']; // gets cell value

      var columnNum = cell['col']; // gets the col number

      var thisRow = cell['row']; // gets the row number

      var colNameToAdd = colNames[columnNum]; // careful, this will be undefined if we hit it on the first pass
      // don't add this row to the return data, but add it to list of column names

      if (thisRow < startRow) {
        colNames[columnNum] = val.toLowerCase();
        continue; // skip the header row
      }

      if (typeof processedResults[thisRow] === 'undefined') {
        processedResults[thisRow] = {};
      }

      if (typeof colNameToAdd !== 'undefined' && colNameToAdd.length > 0) {
        processedResults[thisRow][colNameToAdd] = val;
      }
    } // make sure we're only returning valid, filled data items

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  processedResults = processedResults.filter(function (result) {
    return Object.keys(result).length;
  }); // if we're not filtering, then return all results

  if (returnAllResults || !filter) {
    return processedResults;
  }

  return filterResults(processedResults, filter);
}

var gsheetProcessor = function gsheetProcessor(options, callback) {
  (0, _gsheetsapi.default)(options.sheetId).then(function (result) {
    var filteredResults = processGSheetResults(result, options.returnAllResults || false, options.filter || false);
    callback(filteredResults);
  });
};

var _default = gsheetProcessor;
exports.default = _default;