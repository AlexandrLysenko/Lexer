const Analizer = require('./analizer');
const identifiersTable = require('./identifiersTable');
const SyntaxTreeNode = require('./syntaxTreeNode');
const Keywords = require('./keywords');
const Delimiters = require('./delimiters')
const TreeTostringConverter = require('./treeTostringConverter');
const ParserException = require('./parserException');

analizer = new Analizer()
analizer.parseFile('./test.txt');
// console.log(analizer.returnTokens());

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.tree = new SyntaxTreeNode("SYNTAX TREE",null,0);
    this.currentIndex = 0;
    this.error = null;
    this.alreadyParsedToken;
    this.converter = new TreeTostringConverter();
  }

  getTree() {
    return this.tree;
  }

  parseSignalParser() {
    this.parseProgram(this.tree.newNode('<signal-program>'))
  }

  parseProgram(treeNode) {
    treeNode = treeNode.newNode('<program>');
    this.parseTokenByCode(treeNode, Keywords.PROGRAM, 'keyword PROGRAM');
    this.parseProcedureIdentifier(treeNode);
    this.parseTokenByCode(treeNode, Delimiters.SEMICOLON, 'semicolon');
    this.parseBlock(treeNode);
    this.parseTokenByCode(treeNode, Delimiters.DOT, '.(dot)');
  }

  parseProcedureIdentifier(treeNode) {
    this.parseIdentifier(treeNode.newNode('<procedure-identifier>'));
  }

  parseIdentifier(treeNode) {
    let token = this.getNextToken();
    if(token.getCode() < identifiersTable.CODE_START) {
      parser.printTree(parser.tree)
      throw this.parsingErrorMessage(token, 'identifier');

    }
    treeNode = treeNode.newNode('<identifier>');
    treeNode.addValue(this.tokenToString(token))
  }
  parseBlock(treeNode) {
    treeNode = treeNode.newNode('<block>');
    this.parseDeclarations(treeNode);
    this.parseTokenByCode(treeNode, Keywords.BEGIN, 'keyword BEGIN');
    this.parseStatementsList(treeNode);
    this.parseTokenByCode(treeNode, Keywords.END, 'keyword END');
  }

  parseDeclarations(treeNode) {
    this.parseLabelDeclaration(treeNode.newNode('<declarations>'));
  }

  parseLabelDeclaration(treeNode) {
    let token = this.getNextToken()
    this.alreadyParsedToken = token;
    treeNode = treeNode.newNode('<label-declarations>')
    if (token.getCode() == Keywords.LABEL) {
      this.parseTokenByCode(treeNode, Keywords.LABEL, 'keyword LABEL');
      this.parseUnsignedInteger(treeNode);
      this.parseLabelsList(treeNode);
      this.parseTokenByCode(treeNode, Delimiters.SEMICOLON, 'semicolon');
    } else {
      treeNode.newNode('<empty>');
    }

  }

  parseStatementsList(treeNode) {
    treeNode = treeNode.newNode('<statements-list>')
    if (!this.parseStatement(treeNode)) {
      treeNode.newNode('<empty>');
    } else {
      this.parseStatementsList(treeNode)
    }

  }

  parseStatement(treeNode) {
    let token = this.getNextToken();
    this.alreadyParsedToken = token;
    if (token.getCode() == Keywords.GOTO) {
      treeNode = treeNode.newNode('<statement>');
      this.parseTokenByCode(treeNode, Keywords.GOTO, 'keyword GOTO');
      this.parseUnsignedInteger(treeNode)
      this.parseTokenByCode(treeNode, Delimiters.SEMICOLON, 'semicolon')
      return true;
    } else if (token.getCode() == Keywords.IF) {
      treeNode = treeNode.newNode('<statement>');
      this.parseConditionStatement(treeNode)
      this.parseTokenByCode(treeNode, Keywords.ENDIF, 'keyword ENDIF');
      this.parseTokenByCode(treeNode, Delimiters.SEMICOLON, 'semicolon')
      return true;
    } else if (token.getCode() > 500 && token.getCode() < 1000) {
        treeNode = treeNode.newNode('<statement>');
        this.parseUnsignedInteger(treeNode);
        this.parseTokenByCode(treeNode, Delimiters.COLON, 'colon')
        this.parseStatement(treeNode)
        return true;
    } else if (token.getCode() == Delimiters.SEMICOLON){
        treeNode = treeNode.newNode('<statement>');
        this.parseTokenByCode(treeNode, Delimiters.SEMICOLON, 'semicolon')
        return true;
    } else if(token.getCode() > 1000) {
        treeNode = treeNode.newNode('<assign>');
        this.parseAssign(treeNode)
        return true;
    } else false;
  }

  parseAssign(treeNode) {
    this.parseIdentifier(treeNode);
    this.parseTokenByCode(treeNode, Delimiters.EQUAL, '=');
    this.parseUnsignedInteger(treeNode);
    this.parseTokenByCode(treeNode, Delimiters.SEMICOLON, 'semicolon');
  }

  parseConditionStatement(treeNode) {
    treeNode = treeNode.newNode('<condition-statement>')
    this.parseIncompleteConditionStatement(treeNode)
    this.parseAlternativePart(treeNode)
  }

  parseIncompleteConditionStatement(treeNode) {
    treeNode = treeNode.newNode('<incomplete-condition-statement>')
    this.parseTokenByCode(treeNode, Keywords.IF, 'keyword IF');
    this.parseConditionalExpression(treeNode)
    this.parseTokenByCode(treeNode, Keywords.THEN, 'keyword THEN');
    this.parseStatementsList(treeNode);
  }
  parseConditionalExpression(treeNode) {
    this.parseVariableIdentifier(treeNode);
    this.parseTokenByCode(treeNode, Delimiters.EQUAL, 'keyword IF');
    this.parseUnsignedInteger(treeNode);
  }

  parseAlternativePart(treeNode) {
    let token = this.getNextToken();
    if (token.getCode() == Keywords.ELSE) {
      treeNode = treeNode.newNode('<alternative-part>')
      this.alreadyParsedToken = token;
      this.parseTokenByCode(treeNode, Keywords.ELSE, 'keyword ELSE');
      this.parseStatementsList(treeNode);
    } else {
      this.alreadyParsedToken = token;
      treeNode.newNode('<empty>');

    }

  }

  parseLabelsList(treeNode) {
      var token = this.getNextToken();
      treeNode = treeNode.newNode('<labels-list>');
      if (token.getCode() === Delimiters.COMMA) {
        treeNode.addValue(this.tokenToString(token))
        this.parseUnsignedInteger(treeNode)
        this.parseLabelsList(treeNode)
      }
      else {
        this.alreadyParsedToken = token;
        treeNode.addValue('<empty>');
      }
  }

  parseUnsignedInteger(treeNode) {
    var token = this.getNextToken();
    if (token.getCode() < 500 || token.getCode() > 1000) {
      parser.printTree(parser.tree)
      throw this.parsingErrorMessage(token, 'unsigned-integer')
    }
    treeNode = treeNode.newNode('<unsigned-integer>');
    treeNode.addValue(this.tokenToString(token))
  }

  parseVariableIdentifier(treeNode) {
    this.parseIdentifier(treeNode.newNode('<variable-identifier>'))
  }

  getNextToken() {
    if (this.alreadyParsedToken) {
      let tokenBuff = this.alreadyParsedToken;
      this.alreadyParsedToken = null;
      return tokenBuff;
    }
    let token = this.tokens[this.currentIndex++] || null;
    if (token === null) {
      parser.printTree(parser.tree)
      throw "Parser error: unexpected end of file";
    }
    return token;
  }

  parseTokenByCode(treeNode, tokenCode, expectedToken) {
    let token = this.getNextToken();
    // console.log(token);
    if (token.getCode() === tokenCode) {
      treeNode.newNode(this.tokenToString(token))
    } else {
      parser.printTree(parser.tree)
      throw this.parsingErrorMessage(token, expectedToken);
    }
  }

  parsingErrorMessage(actualToken, expectedToken) {
      // return `Parser error: unexpected token ${actualToken.getValue()} on line ${actualToken.getLineNumber()} at position ${actualToken.getPosition()} , expecting ${expectedToken}`;
      return `Parser: Error, unexpected token '${actualToken.getValue()}' (line ${actualToken.getLineNumber()}, column ${actualToken.getPosition()}): expected '${expectedToken}'`
  }

  showTree() {
  return this.converter.convert(this.tree, 5, true)
  }

  printTree() {
    this.tree.printTree()
  }

  tokenToString(token) {
    return `${token.getCode()}  ${token.getValue()}`
  }

  showTokens() {
    console.table(this.tokens);
  }
}

parser = new Parser(analizer.returnTokens());
parser.showTokens()
analizer.getErrors();
console.table(analizer.identifiersTable.getIdentifiers());
parser.parseSignalParser()
// console.log(parser.getTree());
// parser.showTree();
parser.printTree(parser.tree)
