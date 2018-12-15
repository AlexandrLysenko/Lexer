const Identifier = require('./identifier');
class IdentifiersTable {
  constructor() {
    this.identifiersList = [];
    this.identifierCodeStart = 1000;
    const CODE_START = 1000;
  }

  getIdentifiers() {
    return this.identifiersList;
  }

  addIdentifier(identifier) {
    if(!this.findIdentifierByCode(identifier.getCode())) {
      this.identifiersList.push(identifier)
    }
    return identifier;
  }

  getCodeForIdentifier(value) {
    var identifier = this.findIdentifierByValue(value);
    if (identifier) {
      return identifier.getCode()
    } else {
      return ++this.identifierCodeStart;
    }
  }

  findIdentifierByValue(value) {
    let result = this.identifiersList.filter(identifier => identifier.getValue() === value)
    return result[0] || null
  }

  findIdentifierByCode(code) {
    let result = this.identifiersList.filter(identifier => identifier.getCode() === code)
    return result[0] || null
  }


}
identifiersTable = new IdentifiersTable()

module.exports = identifiersTable;
