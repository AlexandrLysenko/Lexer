const Number = require('./number');
class NumbersTable {
  constructor() {
    this.numbersList = [];
    this.numbersCodeStart = 500;
  }

  getNumbers() {
    return this.numbersList;
  }

  addNumber(number) {
    if(!this.findNumberByCode(number.getCode())) {
      this.numbersList.push(number)
    }
    return number;
  }

  getCodeForNumber(value) {
    var number = this.findNumberByValue(value);
    if (number) {
      return number.getCode()
    } else {
      return ++this.numbersCodeStart;
    }
  }

  findNumberByValue(value) {
    let result = this.numbersList.filter(number => number.getValue() === value)
    return result[0] || null
  }

  findNumberByCode(code) {
    let result = this.numbersList.filter(number => number.getCode() === code)
    return result[0] || null
  }


}
numbersTable = new NumbersTable()
module.exports = numbersTable
