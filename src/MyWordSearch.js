class MyWordSearch {
  constructor(words, wordsNumber, xSize, ySize = xSize) {
    // Rows and columns size
    this.xSize = xSize;
    this.ySize = ySize;
    // The words to use and their number
    this.words = words;
    this.wordsNumber = wordsNumber;
    // The board
    this.board = new Array();
    // The used words and their number
    this.usedWords = new Object();
    this.countUsedWords = 0;

    for (let i = 0; i < this.words.length; i++) {
      if (this.words[i].indexOf("#") != -1)
        throw new Error(`One of the words contains a void character`);
    }

    // Filter words larger than columns/rows in the board
    for (let i = 0; i < this.words.length; i++) {
      if (
        this.words[i].length > this.ySize ||
        this.words[i].length > this.xSize
      )
        this.words.splice(i--, 1);
    }

    // The number of words to be used must be less than or equal the filtered words
    if (this.wordsNumber > this.words.length)
      throw new Error(
        `The value ${this.wordsNumber} must be less than or equal to the word counts`
      );

    // The number of words to use must be less than or equal the columns/rows in the board
    if (this.wordsNumber > this.xSize || this.wordsNumber > this.ySize)
      throw new Error(
        `The value ${this.wordsNumber} must be less than or equal to the column/row on the board`
      );

    this.fillEmptyBoard();
    this.main();
  }

  // :: This method fill all the board with "#" value
  fillEmptyBoard = function () {
    for (let i = 0; i < this.ySize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.xSize; j++) this.board[i][j] = "#";
    }
  };

  // :: This method fill all the items in the board that its value is "#" with random letter
  fillNotEmptyBoard = function () {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    let randIdx;

    if (!this.board.length) this.fillEmptyBoard();

    for (let i = 0; i < this.ySize; i++) {
      for (let j = 0; j < this.xSize; j++) {
        if (this.board[i][j] == "#") {
          randIdx = Math.floor(Math.random() * alpha.length);
          this.board[i][j] = alpha[randIdx];
        }
      }
    }
  };

  // :: This method is for print the words in different path type on the board
  main = function () {
    const pathType = ["VER", "HOR", "UP", "DOWN"];

    while (this.countUsedWords < this.wordsNumber) {
      // Generating a random path type, x-axis, and y-axis for print a word
      let randPathTypeIdx = Math.floor(Math.random() * pathType.length),
        xAxis = Math.floor(Math.random() * this.xSize),
        yAxis = Math.floor(Math.random() * this.ySize);

      // Printing a word on the board in a specific path type, x-axis, and y-axis, if possible...
      // Otherwise if the board can't take any word, the process will be reset from the beginning
      switch (pathType[randPathTypeIdx]) {
        case "VER":
          let verCount = this.straightCount(xAxis, yAxis, this.xSize, "VER");
          if (!verCount) break;
          let verWords = this.words1(xAxis, yAxis, this.xSize, verCount, "VER");
          if (verWords) this.printer1(xAxis, yAxis, verWords, "VER");
          else this.check();
          break;

        case "HOR":
          let horCount = this.straightCount(yAxis, xAxis, this.ySize, "HOR");
          if (!horCount) break;
          let horWords = this.words1(yAxis, xAxis, this.ySize, horCount, "HOR");
          if (horWords) this.printer1(yAxis, xAxis, horWords, "HOR");
          else this.check();
          break;

        case "UP":
          let upCount = this.askewCount(xAxis, yAxis, "UP");
          if (!upCount) break;
          let upWords = this.words2(xAxis, yAxis, upCount, "UP");
          if (upWords) this.printer2(xAxis, yAxis, upWords, "UP");
          else this.check();
          break;

        case "DOWN":
          let downCount = this.askewCount(xAxis, yAxis, "DOWN");
          if (!downCount) break;
          let downWords = this.words2(xAxis, yAxis, downCount, "DOWN");
          if (downWords) this.printer2(xAxis, yAxis, downWords, "DOWN");
          else this.check();
          break;
      }
    }
    // After all the words have been printed, fill the board with random letters
    this.fillNotEmptyBoard();
  };

  // :: This method count how many items in the board array are available to print in. [VER, HOR]
  straightCount = function (axis1, axis2, length, type) {
    let p1, p2;
    if (type == "VER") (p1 = "x"), (p2 = "y");
    else if (type == "HOR") (p1 = "y"), (p2 = "x");
    else
      throw new Error(
        `the passed argument: (${type}) is out of the range. "must be VER/HOR"`
      );

    // Basic Count: without considering whether there is a word used in the same path (column/row)
    let count = length - axis1,
      newCount;

    // Advanced Count: with considering if there is a word used in the same path (column/row)
    for (let i in this.usedWords) {
      if (this.usedWords[i][p2] == axis2) {
        if (axis1 < this.usedWords[i][p1][0]) {
          newCount = this.usedWords[i][p1][0] - axis1;
          if (newCount < count) count = newCount;
        }
        if (
          axis1 >= this.usedWords[i][p1][0] &&
          axis1 <= this.usedWords[i][p1][1]
        )
          return false;
      }
    }
    return count;
  };

  // :: This method count how many items in the board array are available to print in. [UP, DOWN]
  askewCount = function (xAxis, yAxis, type) {
    if (type != "DOWN" && type != "UP")
      throw new Error(
        `the passed argument: (${type}) is out of the range. "must be DOWN/UP"`
      );

    // xLength is the (x-axis - row size): available items to print in
    // yLength is the (y-axis - column size): available items to print in
    let xLength, yLength;
    if (type == "DOWN")
      (xLength = this.xSize - xAxis), (yLength = this.ySize - yAxis);
    else (xLength = this.xSize - xAxis), (yLength = yAxis + 1);

    // Basic Count: without considering whether there is a word used in the same path (skew-up/skew-down)
    let count, newCount;
    if (xLength <= yLength) count = xLength;
    else count = yLength;

    // Finding the endpoint for the x-axis and y-axis
    let endAxis1 = new Object();
    if (xLength <= yLength) {
      endAxis1.x = this.xSize - 1;
      endAxis1.y =
        type == "DOWN"
          ? this.xSize - xAxis + yAxis - 1
          : yAxis - (this.xSize - xAxis) + 1;
    } else {
      endAxis1.x =
        type == "DOWN" ? this.ySize - yAxis + xAxis - 1 : yAxis + xAxis;
      endAxis1.y = type == "DOWN" ? this.ySize - 1 : 0;
    }

    let endAxis2 = new Object();
    for (let i in this.usedWords) {
      if (this.usedWords[i].type == type) {
        if (type == "DOWN") {
          (xLength = this.xSize - this.usedWords[i]["x"][0]),
            (yLength = this.ySize - this.usedWords[i]["y"][0]);
        } else {
          (xLength = this.xSize - this.usedWords[i]["x"][0]),
            (yLength = this.usedWords[i]["y"][0] + 1);
        }

        // Finding the endpoint for the x-axis and y-axis
        if (xLength <= yLength) {
          endAxis2.x = this.xSize - 1;
          endAxis2.y =
            type == "DOWN"
              ? this.xSize -
                this.usedWords[i]["x"][0] +
                this.usedWords[i]["y"][0] -
                1
              : this.usedWords[i]["y"][0] -
                (this.xSize - this.usedWords[i]["x"][0]) +
                1;
        } else {
          endAxis2.x =
            type == "DOWN"
              ? this.ySize -
                this.usedWords[i]["y"][0] +
                this.usedWords[i]["x"][0] -
                1
              : this.usedWords[i]["y"][0] + this.usedWords[i]["x"][0];
          endAxis2.y = type == "DOWN" ? this.ySize - 1 : 0;
        }

        // Advanced Count: with considering if there is a word used in the same path (skew-up/skew-down)
        if (endAxis1.x == endAxis2.x && endAxis1.y == endAxis2.y) {
          if (xAxis < this.usedWords[i]["x"][0]) {
            newCount = this.usedWords[i]["x"][0] - xAxis;
            if (newCount < count) count = newCount;
          }
          if (
            xAxis <= this.usedWords[i]["x"][1] &&
            xAxis >= this.usedWords[i]["x"][0]
          )
            return false;
        }
        endAxis2 = new Object();
      }
    }
    return count;
  };

  // :: This method is for filtering the right words for the x-axis/y-axis
  words1 = function (axis1, axis2, gridLength, wordLength, type) {
    const _words = this.words.filter((word) => word.length <= wordLength);

    // Getting the letters used in the same path (column/row)
    const letters = new Object();
    let letterIdx = 0;
    for (let i = axis1; i < gridLength; i++) {
      let check =
        type == "VER"
          ? this.board[axis2][i] != "#"
          : this.board[i][axis2] != "#";
      if (check) {
        letters[letterIdx++] = {
          char: type == "VER" ? this.board[axis2][i] : this.board[i][axis2],
          idx: i,
        };
      }
    }

    // Filtering the words that are not synchronous with the letters position
    for (let j = 0; j < _words.length; j++) {
      for (let i in letters) {
        if (_words[j][letters[i]["idx"] - axis1] != letters[i]["char"]) {
          if (_words[j].length + axis1 - 1 >= letters[i]["idx"]) {
            _words.splice(j--, 1);
            break;
          }
        }
      }
    }

    // Filterig the used words
    for (let i = 0; i < _words.length; i++) {
      for (let j in this.usedWords) {
        if (_words[i] == this.usedWords[j].word) {
          _words.splice(i--, 1);
          break;
        }
      }
    }

    if (_words.length) return _words;
    else return false;
  };

  // :: This method is for filtering the right words for the x-axis and y-axis
  words2 = function (xAxis, yAxis, wordLength, type) {
    const _words = this.words.filter((word) => word.length <= wordLength);

    // Getting the letters used in the same path (column/row)
    const letters = new Object();
    let letterIdx = 0,
      i = xAxis,
      j = yAxis,
      count = 0;
    while (count < wordLength) {
      if (this.board[j][i] != "#") {
        letters[letterIdx++] = {
          char: this.board[j][i],
          idx: [i, j],
        };
      }
      i++, count++, type == "DOWN" ? j++ : j--;
    }

    // Filtering the words that are not synchronous with the letters position
    for (let j = 0; j < _words.length; j++) {
      for (let i in letters) {
        if (_words[j][letters[i]["idx"][0] - xAxis] != letters[i]["char"]) {
          if (_words[j].length + xAxis - 1 >= letters[i]["idx"][0]) {
            _words.splice(j--, 1);
            break;
          }
        }
      }
    }

    // Filterig the used words
    for (let i = 0; i < _words.length; i++) {
      for (let j in this.usedWords) {
        if (_words[i] == this.usedWords[j].word) {
          _words.splice(i--, 1);
          break;
        }
      }
    }

    if (_words.length) return _words;
    else return false;
  };

  // :: This method print a word in the board. [VER, HOR]
  printer1 = function (axis1, axis2, words, type) {
    let randIdx = Math.floor(Math.random() * words.length);

    // Print a random word on the board
    for (let i = axis1, c = 0; c < words[randIdx].length; i++, c++) {
      if (type == "VER") this.board[axis2][i] = words[randIdx][c];
      else this.board[i][axis2] = words[randIdx][c];
    }

    // Store the used word in a object with its info
    this.usedWords[this.countUsedWords++] = {
      type: type,
      x: type == "VER" ? [axis1, axis1 + (words[randIdx].length - 1)] : axis2,
      y: type == "VER" ? axis2 : [axis1, axis1 + (words[randIdx].length - 1)],
      word: words[randIdx],
    };
  };

  // :: This method print a word in the board. [UP, DOWN]
  printer2 = function (xAxis, yAxis, words, type) {
    let randIdx = Math.floor(Math.random() * words.length);

    // Print a random word on the board
    for (let i = xAxis, j = yAxis, c = 0; c < words[randIdx].length; c++) {
      this.board[j][i] = words[randIdx][c];
      i++, type == "DOWN" ? j++ : j--;
    }

    // Store the used word in a object with its info
    this.usedWords[this.countUsedWords++] = {
      type: type,
      x: [xAxis, xAxis + (words[randIdx].length - 1)],
      y:
        type == "DOWN"
          ? [yAxis, yAxis + (words[randIdx].length - 1)]
          : [yAxis, yAxis - words[randIdx].length + 1],
      word: words[randIdx],
    };
  };

  // :: This method checks whether the board can't take any word or not
  check = function () {
    let count, words;

    for (let i = 0; i < this.ySize; i++) {
      for (let j = 0; j < this.xSize; j++) {
        count = this.straightCount(j, i, this.xSize, "VER");
        words = this.words1(j, i, this.xSize, count, "VER");
        if (words) return 0;

        count = this.straightCount(i, j, this.ySize, "HOR");
        words = this.words1(i, j, this.ySize, count, "HOR");
        if (words) return 0;

        count = this.askewCount(j, i, "UP");
        words = this.words2(j, i, count, "UP");
        if (words) return 0;

        count = this.askewCount(j, i, "DOWN");
        words = this.words2(j, i, count, "DOWN");
        if (words) return 0;
      }
    }
    this.board = new Array();
    this.usedWords = new Object();
    this.countUsedWords = 0;
    this.fillEmptyBoard();
  };
}
