const Delimiter = require('./delimiter')

class DelimitersTable {
  constructor() {
    this.delimitersList = [];
  }
  addDelimiter(delimiter) {
    this.delimitersList.push(delimiter)
  }
  getDelimiterNumber(value) {
    let result = this.delimitersList.filter(delimiter => delimiter.getValue() === value)
    return result[0] || null;
  }
  getAllTable() {
    console.table(this.delimitersList);
  }
}
delimitersTable = new DelimitersTable()

delimiter1 = new Delimiter(';', 41)
delimiter2 = new Delimiter('.', 42)
delimiter3 = new Delimiter(',', 43)
delimiter4 = new Delimiter(':', 44)
delimiter5 = new Delimiter('=', 45)

delimitersTable.addDelimiter(delimiter1)
delimitersTable.addDelimiter(delimiter2)
delimitersTable.addDelimiter(delimiter3)
delimitersTable.addDelimiter(delimiter4)
delimitersTable.addDelimiter(delimiter5)

module.exports = delimitersTable;
