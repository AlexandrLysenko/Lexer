const SyntaxTreeNode = require('./syntaxTreeNode');
module.exports =  class TreeTostringConverter {
  constructor() {
    this.result = "";
  }

  convert(tree, linesSize, spaceBeforeValue) {
    this.convertRecursive(tree, linesSize)
    console.log(this.result);
    return this.result;
  }

  convertRecursive(tree, linesSize, spaceBeforeValue, level = -1, prevLevels = []) {
    var result = "";
    if (tree.getParent()) {
      for (let i = 0; i < level * linesSize; i++) {
        result += (in_array((i - linesSize) / linesSize, prevLevels) ? '│' : ' ');
      }
      if (in_array(level - 1, prevLevels)) {
        result += "├";;
        for(let i = 0; i < linesSize - 2; i++) {
          result +=  "─";
        }
      } else {
        result += "└";
        for (let i = 0; i < linesSize - 2; i++) {
            result += "─";
        }
      }
      if (spaceBeforeValue) {
        result += " ";
      }
      result += `${tree.getValue()}\n`;
    }

    var self = this;

    tree.getChildNodes().forEach(function(childNode, index, tree) {
      var prevLevelsToPass = prevLevels;
      if(index != tree[index].getChildNodes().length - 1) {
        prevLevelsToPass.push(level)
      }
      result += self.convertRecursive(childNode, linesSize, spaceBeforeValue, level+1, prevLevelsToPass)
    })
    this.result = result;
    return this.result;
  }

}

function arrayCompare(a1, a2) {
    if (a1.length != a2.length) return false;
    var length = a2.length;
    for (var i = 0; i < length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

function in_array (needle, haystack, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/in_array/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: vlado houba
  // improved by: Jonas Sciangula Street (Joni2Back)
  //    input by: Billy
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: true
  //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
  //   returns 2: false
  //   example 3: in_array(1, ['1', '2', '3'])
  //   example 3: in_array(1, ['1', '2', '3'], false)
  //   returns 3: true
  //   returns 3: true
  //   example 4: in_array(1, ['1', '2', '3'], true)
  //   returns 4: false

  var key = ''
  var strict = !!argStrict

  // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
  // in just one for, in order to improve the performance
  // deciding wich type of comparation will do before walk array
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) { // eslint-disable-line eqeqeq
        return true
      }
    }
  }

  return false
}
