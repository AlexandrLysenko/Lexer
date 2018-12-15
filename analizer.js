var fs = require('fs');
var colors = require('colors');
const keywordsTable = require('./keywordsTable');
const identifiersTable = require('./identifiersTable');
const DelimitersTable = require('./delimitersTable')
const Identifier = require('./identifier');
const SymbolCategory = require('./symbolCategory');
const Symbol = require('./symbol');
const Token = require('./token');
const Number = require('./number');
const NumbersTable = require('./numbersTable');
const cTable = require('console.table');

module.exports = class Analizer {
  constructor() {
    this.identifiersTable = identifiersTable;
    this.keywordsTable = keywordsTable;
    this.symbolCategory = SymbolCategory;
    this.numbersTable = NumbersTable;
    this.delimitersTable = DelimitersTable;
    this.tokens = [];
    this.errors = [];
    this.fileData;
    this.index = 0;

    this.lineNumber;
    this.position;

  }
  getIdentifiers() {
    this.identifiersTable.getIdentifiers();
    console.table(this.keywordsTable.getAllTable());
    console.table(this.symbolCategory);
  }
  resolveCategory(code) {
    if (code >= 65 && code <= 90) return this.symbolCategory.LETTER
    if (code >= 48 && code <= 57) return this.symbolCategory.DIGIT
    if (code == 58 || code == 59 || code == 60 || code == 46 || code == 61 || code == 44)
      return this.symbolCategory.DELIMITER
    if (code == 35) return this.symbolCategory.TASK
    if (code >= 8 && code <= 14) return this.symbolCategory.WHITESPACE
    if (code == 32) return this.symbolCategory.WHITESPACE
    if (code == 40) return this.symbolCategory.COMMENT_BEGIN
    return this.symbolCategory.ERROR
  }
  parseFile(filePath) {
    this.lineNumber = 1;
    this.position = 0;
    this.fileData = this.getFileData(filePath)
    let currentSymbol;
    beginning: while (!(currentSymbol = this.getNextCharacter()).isEOF()) {


      if (currentSymbol.getCategory() === this.symbolCategory.LETTER) {
        let token = '';
        token += currentSymbol.getCharacter()
        var tokenLineNumber = this.lineNumber;
        var tokenPosition = this.position;
        do {
          currentSymbol = this.getNextCharacter()
          if (currentSymbol.getCategory() === this.symbolCategory.LETTER ||
            currentSymbol.getCategory() === this.symbolCategory.DIGIT) {
            token += currentSymbol.getCharacter()
          }

        } while (currentSymbol.getCategory() === this.symbolCategory.LETTER ||
          currentSymbol.getCategory() === this.symbolCategory.DIGIT);
        if (this.keywordsTable.getKeywordNumber(token)) {
          let keywordNumber = this.keywordsTable.getKeywordNumber(token)
          this.tokens.push(new Token(keywordNumber.getCode(), token, tokenLineNumber, tokenPosition))
        } else {
          let identifier = this.identifiersTable.addIdentifier(
            new Identifier(token, this.identifiersTable.getCodeForIdentifier(token))
          )
          this.tokens.push(
            new Token(identifier.getCode(), identifier.getValue(), tokenLineNumber, tokenPosition)
          )
        }
      }
      if (currentSymbol.getCategory() === this.symbolCategory.DIGIT) {
        let token = '';
        token += currentSymbol.getCharacter()
        var tokenLineNumber = this.lineNumber;
        var tokenPosition = this.position;
        do {
          var error = false;
          currentSymbol = this.getNextCharacter()
          if (currentSymbol.getCategory() === this.symbolCategory.DIGIT) {
            token += currentSymbol.getCharacter()
          } else if (currentSymbol.getCategory() === this.symbolCategory.LETTER) {
            do {
              if (currentSymbol.getCategory() === this.symbolCategory.LETTER || currentSymbol.getCategory() === this.symbolCategory.DIGIT) {
                token += currentSymbol.getCharacter()
              }
              currentSymbol = this.getNextCharacter()
            } while (currentSymbol.getCategory() === this.symbolCategory.LETTER || currentSymbol.getCategory() === this.symbolCategory.DIGIT);
            error = true;
            this.errors.push(
              this.invalidLetterError(tokenPosition, tokenLineNumber, token, filePath)
            )
          }

        } while (currentSymbol.getCategory() === this.symbolCategory.DIGIT);
        if (!error) {
          let number = this.numbersTable.addNumber(
            new Number(token, this.numbersTable.getCodeForNumber(token))
          )
          this.tokens.push(
            new Token(number.getCode(), number.getValue(), tokenLineNumber, tokenPosition)
          )
        }
      }

      if (currentSymbol.getCategory() === this.symbolCategory.COMMENT_BEGIN) {
        let commentLineNumber = this.lineNumber;
        let commentPosition = this.position;
        let end = false;
        var nextSymbol = this.getNextCharacter();
        if (nextSymbol.getCharacter() === '*') {
          do {

            currentSymbol = this.getNextCharacter();
            if (currentSymbol.getCharacter() === '*') {

              do {
                nextSymbol = this.getNextCharacter();
              } while (nextSymbol.getCharacter() === '*');
              if (nextSymbol.getCharacter() === ')') {
                continue beginning;
              } else if (nextSymbol.getCharacter() === null) {
                this.errors.push(
                  this.unclosedCommentError(commentPosition, commentLineNumber, filePath)
                )
                return;
              }

            } else if (currentSymbol.getCharacter() == null) {
              console.log('default error')
              this.errors.push(
                this.unclosedCommentError(commentPosition, commentLineNumber, filePath)
              );
              return;
            }
          } while (currentSymbol.getCharacter() != null);
        }
      }
      // currentSymbol = nextSymbol;

      if (currentSymbol.getCategory() === this.symbolCategory.WHITESPACE) {
        continue;
      }

      if (currentSymbol.getCategory() === this.symbolCategory.DELIMITER) {
        tokenPosition = this.position;
        tokenLineNumber = this.lineNumber;
        this.tokens.push(
          new Token(currentSymbol.getCharacter().charCodeAt(0),
            currentSymbol.getCharacter(), this.lineNumber, this.position));
        continue;
      }

      if (currentSymbol.getCategory() === this.symbolCategory.TASK) {
        let token = '';
        token += currentSymbol.getCharacter()
        let letterSymbol;
        let digitSymbol1;
        let digitSymbol2;
        let finalSymbol;
        task: do {
          // console.log(token);
          currentSymbol = this.getNextCharacter();
          token += currentSymbol.getCharacter()
          if (currentSymbol.getCharacter() === '#') {
            do {
              nextSymbol = this.getNextCharacter();
              token += nextSymbol.getCharacter()
              if (nextSymbol && nextSymbol.getCharacter() != '#') {
                break;
              }
            } while (nextSymbol.getCharacter() === '#');
            if (nextSymbol.getCategory() === this.symbolCategory.LETTER &&
              (digitSymbol1 = this.getNextCharacter()).getCategory() === this.symbolCategory.DIGIT &&
              (digitSymbol2 = this.getNextCharacter()).getCategory() === this.symbolCategory.DIGIT &&
              (finalSymbol = this.getNextCharacter()).getCategory() === this.symbolCategory.TASK) {
              // console.log(thirdSymbol.getCharacter());
              token += digitSymbol1.getCharacter();
              token += digitSymbol2.getCharacter();
              token += finalSymbol.getCharacter();
              if (this.keywordsTable.getKeywordNumber(token)) {
                let keywordNumber = this.keywordsTable.getKeywordNumber(token)
                this.tokens.push(new Token(keywordNumber.getCode(), token, tokenLineNumber, tokenPosition))
              } else {
                let identifier = this.identifiersTable.addIdentifier(
                  new Identifier(token, this.identifiersTable.getCodeForIdentifier(token))
                )
                this.tokens.push(
                  new Token(identifier.getCode(), identifier.getValue(), tokenLineNumber, tokenPosition)
                )
                continue beginning;
              }
            } else if (nextSymbol.getCategory() === this.symbolCategory.WHITESPACE) {
              this.errors.push("Identifier error, format shoul be #...#A99#")
              return;
            } else {
              if (digitSymbol1) {
                token += digitSymbol1.getCharacter();
              }
              if (digitSymbol2) {
                token += digitSymbol2.getCharacter();
              }
              continue task;
              return;
            }

          } else if (currentSymbol.getCharacter() == null) {
            this.errors.push("Unexpected end of file")
            return;
          } else if (currentSymbol.getCategory() === this.symbolCategory.WHITESPACE) {
            this.errors.push(
              this.unexpectedTokenError(currentSymbol, this.position, this.lineNumber, filePath)
            )
            return;
          }

        } while (currentSymbol.getCharacter() != null);
      }
      console.log(currentSymbol)
      if (currentSymbol.getCharacter() != null) {
        this.errors.push(
          this.unexpectedSymbolError(currentSymbol,
            this.position, this.lineNumber, filePath)
        )
        console.log('default error erer')
      }
    }
  }



  getNextCharacter(position) {
    if (this.fileData[this.index] && !position) {
      if (this.fileData[this.index].charCodeAt(0) == 10) {
        this.lineNumber++;
        this.position = 0;
      } else {
        this.position++;
      }

    }
    this.index++;
    if (position) {
      console.log(position);
      return new Symbol(this.fileData[this.index - 3], this.resolveCategory(this.fileData[this.index - 3].charCodeAt(0)) || undefined)
    }
    if (this.index <= this.fileData.length) {
      return new Symbol(this.fileData[this.index - 1], this.resolveCategory(this.fileData[this.index - 1].charCodeAt(0)) || undefined)
    }
    return new Symbol(null, null)
  }


  getTokens() {
    console.log("------------Tokens Table-----------\n");
    console.table(this.tokens);
    console.log("---------END Tokens Table----------");
    // this.keywordsTable.getAllTable();
    // console.table(this.identifiersTable.getIdentifiers());
  }


  invalidLetterError(position, lineNumber, token, filePath) {
    return `Lexer: Error (${lineNumber}, ${position}):Invalid digit '${token}' in ${filePath}`;
  }

  unclosedCommentError(commentPosition, commentLineNumber, filePath) {
    return `Lexer: Error (${commentLineNumber}, ${commentPosition}):Unclosed comment in ${filePath}`;
  }

  unexpectedSymbolError(symbol, position, lineNumber, filePath) {
    return `Lexer: Error (${lineNumber}, ${position}):Unexpected symbol '${symbol.getCharacter()}' in ${filePath}`
  }

  unexpectedTokenError(symbol, position, lineNumber, filePath) {
    return `Lexer: Error (${lineNumber}, ${position+1}):Unexpected symbol '${symbol.getCharacter()}' in ${filePath}`
  }

  getFileData(filePath) {
    return fs.readFileSync(filePath, 'utf8')
  }

  getErrors() {
    if (this.errors[0]) {
      console.log("\n\n**************ERRORS*****************\n");
      this.errors.forEach(error => {
        console.log(error.red.bgWhite);
      });
      console.log("\n************END ERRORS*************\n\n");
    }
  }
  returnTokens() {
    return this.tokens;
  }

}

identifiersTable.getIdentifiers()



// console.log(SymbolCategory.WHITESPACE);