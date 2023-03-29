/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var fs = require('fs');

function translateSegment(segment) {
  try {
    var seg_name = segment[0];
    var format = fs
      .readFileSync(
        path.dirname(fs.realpathSync(__filename)) +
          '/segments/' +
          seg_name +
          '.txt',
      )
      .toString();
    format = format.split('\n');
    var data = {};
    data.Segment = segment[0];
    for (var i = 1; i < Math.min(segment.length, format.length - 1); i++) {
      var field_name = format[i + 1].split('\t')[5];
      data[field_name] = segment[i];
    }
    return data;
  } catch (ex) {
    console.log(ex); //for debug
  }
}

function translate(data) {
  var tr = [];
  for (var seg in data) {
    tr.push(translateSegment(data[seg]));
  }
  return tr;
}

module.exports = {
  translate: translate,
};
