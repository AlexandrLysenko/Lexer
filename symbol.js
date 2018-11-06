module.exports = class Symbol {
  constructor(character, category) {
    this.character = character;
    this.category = category;
  }
  getCategory() {
    return this.category;
  }
  getCharacter() {
    return this.character;
  }

  isEOF() {
    return this.character === null;
  }
}
