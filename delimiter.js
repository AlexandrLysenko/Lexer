module.exports = class Delimiter {

  constructor(value, code) {
    this.value = value;
    this.code = code;
  }


  getValue() {
    return this.value;
  }

  getCode() {
    return this.code;
  }
}
