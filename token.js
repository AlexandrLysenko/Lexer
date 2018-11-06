module.exports = class Token {
  constructor(code, value, lineNumber, position) {
    this.code = code;
    this.value = value;
    this.lineNumber = lineNumber;
    this.position = position;
  }

  getInfo() {
    return {
      code: this.code,
      value: this.value,
      line: this.lineNumber,
      position: this.position
    }
  }

}
