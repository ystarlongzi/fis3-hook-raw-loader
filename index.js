var legalFiles = {};

function onProcessStart(file) {
  if (!file.isJsLike) {
    return;
  }

  var content = file.getContent();
  var rRequire1 = /import\s+(?:(\w+)\s+from)?\s*('|")((?:!*)raw!.+?)\2/g;
  var rRequire2 = /(?:var\s+(\w+)\s*=\s*)?\brequire\s*\(\s*('|")((?:!*)raw!.+?)\2\s*\)/g;

  [rRequire1, rRequire2].forEach(function (reg) {
    content = content.replace(reg, function (str, declare, quote, value) {
      legalFiles[file.getId()] = true;

      return 'var ' + declare + ' = __fis__raw("' + value + '");';
    });
  });

  file.setContent(content);
}

function onProcessEnd(file) {
  if (!legalFiles[file.getId()]) {
    return;
  }

  var content = file.getContent();
  var reg = /__fis__raw\("(!*)raw!(.+?)"\)/g;

  content = content.replace(reg, function (str, isSource, value) {
    var rawFile = fis.project.lookup(value, file).file;
    var newStr;

    if (!rawFile) {
      return str;
    }

    if (rawFile.isText()) {
      if (isSource) {
        newStr = fis.util.read(rawFile.realpath);
      }
      else {
        fis.compile(rawFile);
        newStr = rawFile.getContent();
      }
    }
    else {
      newStr = rawFile.getBase64() + fis.util.base64(rawFile.getContent());
    }

    return JSON.stringify(newStr);
  });

  file.setContent(content);
}


module.exports = function (fis) {
  fis.on('process:start', onProcessStart);
  fis.on('process:end', onProcessEnd);
};

