module.exports = class Keyword {

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
