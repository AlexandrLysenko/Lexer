const Keyword = require('./keyword')

class KeywordsTable {
  constructor() {
    this.keywordsList = [];
  }
  addKeyword(keyword) {
    this.keywordsList.push(keyword)
  }
  getKeywordNumber(value) {
    let result = this.keywordsList.filter(keyword => keyword.getValue() === value)
    return result[0] || null;
  }
  getAllTable() {
    console.table(this.keywordsList);
  }
}
keywordsTable = new KeywordsTable()

keyword1 = new Keyword('PROGRAM', 401)
keyword2 = new Keyword('BEGIN', 402)
keyword3 = new Keyword('END', 403)
keyword4 = new Keyword('LABEL', 404)
keyword5 = new Keyword('IF', 405)
keyword6 = new Keyword('THEN', 406)
keyword7 = new Keyword('ELSE', 407)
keyword8 = new Keyword('ENDIF', 408)
keyword9 = new Keyword('GOTO', 409)

keywordsTable.addKeyword(keyword1)
keywordsTable.addKeyword(keyword2)
keywordsTable.addKeyword(keyword3)
keywordsTable.addKeyword(keyword4)
keywordsTable.addKeyword(keyword5)
keywordsTable.addKeyword(keyword6)
keywordsTable.addKeyword(keyword7)
keywordsTable.addKeyword(keyword8)
keywordsTable.addKeyword(keyword9)

module.exports = keywordsTable;
