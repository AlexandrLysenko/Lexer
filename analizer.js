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

class Analizer {
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
    if( code >= 65 && code <= 90) return this.symbolCategory.LETTER
    if( code >= 48 && code <= 57) return this.symbolCategory.DIGIT
    if( code == 58 || code == 59 || code == 60 || code == 46 || code == 61 || code == 44)
     return this.symbolCategory.DELIMITER
    if( code >= 8 && code <= 14) return this.symbolCategory.WHITESPACE
    if( code == 32 ) return this.symbolCategory.WHITESPACE
    if( code == 40 ) return this.symbolCategory.COMMENT_BEGIN
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
          if (currentSymbol.getCategory() === this.symbolCategory.LETTER
          || currentSymbol.getCategory() === this.symbolCategory.DIGIT ) {
            token += currentSymbol.getCharacter()
          }

        } while (currentSymbol.getCategory() === this.symbolCategory.LETTER
        || currentSymbol.getCategory() === this.symbolCategory.DIGIT );
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
          if (currentSymbol.getCategory() === this.symbolCategory.DIGIT ) {
            token += currentSymbol.getCharacter()
          } else if(currentSymbol.getCategory() === this.symbolCategory.LETTER)  {
            do {
              currentSymbol = this.getNextCharacter()
              if (currentSymbol.getCategory() === this.symbolCategory.LETTER || currentSymbol.getCategory() === this.symbolCategory.DIGIT) {
                token += currentSymbol.getCharacter()
              }
            } while (currentSymbol.getCategory() === this.symbolCategory.LETTER || currentSymbol.getCategory() === this.symbolCategory.DIGIT);
            error = true;
            this.errors.push(
              this.invalidLetterError(tokenPosition, tokenLineNumber, token, filePath)
            )
          }

        } while (currentSymbol.getCategory() === this.symbolCategory.DIGIT );
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
      console.log(currentSymbol)
       if(currentSymbol.getCharacter() != null) {
        this.errors.push(
          this.unexpectedSymbolError(currentSymbol,
             this.position, this.lineNumber, filePath)
           )
           console.log('default error erer')
      }
    }
  }



  getNextCharacter(position) {

    let prevLineNumber = this.lineNumber;
    let prevPosition = this.position;
    if(this.fileData[this.index]) {
      if (this.fileData[this.index].charCodeAt(0) == 10 ) {
        this.lineNumber++;
        this.position = 0;
      } else {
          this.position++;
        }

      }
    this.index++;
    if (this.index <= this.fileData.length) {
      return new Symbol(this.fileData[this.index-1], this.resolveCategory(this.fileData[this.index-1].charCodeAt(0)) || undefined)
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

  getFileData(filePath) {
    return fs.readFileSync(filePath, 'utf8')
  }

  getErrors() {
    if(this.errors[0]) {
      console.log("\n\n**************ERRORS*****************\n");
      this.errors.forEach(error => {
        console.log(error.red.bgWhite);
      });
      console.log("\n************END ERRORS*************\n\n");
    }
  }

}




parser = new Analizer()
parser.getIdentifiers()
parser.parseFile('./textl.txt');
parser.getTokens()
parser.getErrors()
// console.log(SymbolCategory.WHITESPACE);
