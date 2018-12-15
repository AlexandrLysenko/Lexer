module.exports = class Token {
  constructor(code, value, lineNumber, position, error) {
    this.code = code;
    this.value = value;
    this.lineNumber = lineNumber;
    this.position = position;
  }

  getCode() {
    return this.code;
  }

  getValue() {
    return this.value;
  }

  getLineNumber() {
    return this.lineNumber;
  }

  getPosition() {
    return this.position;
  }

  getInfo() {
    return {
      code: this.code,
      value: this.value,
      line: this.lineNumber,
      position: this.position
    }
  }
  hasError(){
    return this.error == true;
  }

}
