var fs = require('fs');
const keywordsTable = require('./keywordsTable');
const IdentifiersTable = require('./identifiersTable')
const Identifier = require('./identifier');

var identifiersTable = new IdentifiersTable()

console.log(keywordsTable.getKeywordNumber('GOTO'));
keywordsTable.getAllTable();


idn1 = new Identifier('let');
console.log(identifiersTable.addIdentifier(idn1));
console.log(identifiersTable.getIdentifiers());
console.log(identifiersTable.findIdentifierByValue(idn1));
// console.log(identifiersTable.getCodeForIdentifier(idn1));

var result = {};
var array = []

function printResult(array) {
    for (var i = 0; i < array.length; i++) {
      console.log(array[i].data + `(${array[i].row},${array[i].col})`);
    }
}

// fs.readFile('./test.txt', 'utf8', (err, data) => {
//   if (err) throw err;
//   console.log('************input program **************');
//   console.log(data);
//   console.log('************end input*******************');
//   var row = 1;
//   for (var i = 0; i < data.length; i++) {
//     var col = i;
//     var symbol = {}
//     symbol.data = data.charCodeAt(i);
//     if(data.charCodeAt(i) == 13 )  row++;
//     symbol.row = row;
//     symbol.col = ++col;
//     array.push(symbol);
//     console.log(row);
//     // console.log(data[i] + '---' + i);
//     console.log("symbol:"+data[i]+"----"+"ASCII code="+data.charCodeAt(i));
//   }
//   printResult(array);
// });
