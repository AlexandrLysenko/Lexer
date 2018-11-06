module.exports = class Number {
  constructor(value, code) {
    this.value = value;
    this.code = code;
  }
  getCode() {
    return this.code;
  }
  getValue() {
    return this.value;
  }
  getJson() {
    return {
      'code': this.code,
      'value': this.value
    };
  }
}
