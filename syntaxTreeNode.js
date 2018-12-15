module.exports = class SyntaxTreeNode {

  constructor(value, parent, depth) {
    this.childNodes = [];
    this.value = value;
    this.depth = depth;
    if (parent) {
      this.parent = parent;
    } else {
      this.parent = null;
    }
  }

    getParent() {
      return this.parent
    }

    getChildNodes() {
      return this.childNodes
    }

    getValue() {
      return this.value
    }

    newNode(value) {
      let node = new SyntaxTreeNode(value, this, this.depth + 1)
      this.childNodes.push(node)
      return node;
    }

    printTree() {
      for(let i = 0; i < this.depth; i++) {
        process.stdout.write("....");
      }
      console.log(this.value);
      var self = this;
      this.childNodes.forEach(function(child) {
        child.printTree()
      })
    }

    addValue(value) {
      let node = new SyntaxTreeNode(value, this.parent, this.depth + 1);
      this.childNodes.push(node);
      return this;
    }

    end() {
      return this.parent;
    }
}
