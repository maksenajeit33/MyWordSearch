
![Logo](https://iili.io/5KdoAv.png)

    
# MyWordSearch

MyWordSearch it's a Word Search game generator. that creates a Word Search board as you want it.
## Examples

```javascript
const words = ["JAVASCRIPT", "PHP", "HTML", "LARAVEL", "HTTPS", "PYTHON"];

/*
 * [words] argument is the words that you want to be use
 * [6] argument is how many words you want to be use
 * [10] argument is the size of the rows
 * [14] argument is the size of the columns
*/
const myWordSearch = new MyWordSearch(words, 6, 10, 14);

console.log(myWordSearch.board);

// ['c', 'x', 'a', 'v', 'f', 't', 'u', 'p', 'J', 'r']
// ['g', 'P', 'H', 'P', 'p', 'b', 'z', 'k', 'A', 'r']
// ['P', 'u', 'z', 'x', 'y', 'v', 'c', 'i', 'V', 'e']
// ['i', 'Y', 'H', 'c', 'i', 'w', 'h', 'q', 'A', 'v']
// ['z', 'y', 'T', 'T', 'l', 'f', 's', 'i', 'S', 'd']
// ['j', 'H', 'a', 'H', 'M', 'v', 'v', 'f', 'C', 'p']
// ['q', 'T', 'r', 'a', 'O', 'L', 'p', 'L', 'R', 'y']
// ['k', 'T', 'o', 'x', 'r', 'N', 'E', 'y', 'I', 'i']
// ['n', 'P', 's', 'u', 'd', 'V', 's', 'b', 'P', 'b']
// ['j', 'S', 'h', 'e', 'A', 'y', 'n', 'a', 'T', 'l']
// ['g', 'u', 'e', 'R', 'f', 'z', 'x', 'f', 'v', 'c']
// ['v', 'a', 'A', 'u', 'a', 'f', 'x', 'x', 'q', 'y']
// ['b', 'L', 's', 'w', 'p', 't', 'e', 'x', 'v', 'h']
// ['z', 'a', 'v', 'x', 'w', 'r', 'y', 's', 'y', 'z']

```

## Usage

```javascript
In Process..

```

  
## Installation

Install MyWordSearch with cdn

```
https://cdn.jsdelivr.net/gh/maksenajeit33/MyWordSearch/dist/mywordsearch-v1.js

```
    
## Features

- `board` Property - Gets the board an 3D array
- `usedWords` Property - Gets the words that have been used as an Object. the Object has four properties which is: **type** *(Path of the word [DOWN, UP, VER, or HOR])*, **word** *(the word)*, **x** *(x-axis [start|end])*, and **y** *(y-axis [start|end])*.
- `countUsedWords` Property - Gets the number of the used words

  
## Demo

In Process..
  
## Authors

- [@maksenajeit33](https://www.github.com/maksenajeit33)

  
## Tech Stack

**Client:** JavaScript, Object-oriented programming
  
## Feedback

If you have any feedback, please reach out to me at khaledjait11@gmail.com

  
## Related

Here are some related projects

[MySudoku](https://github.com/maksenajeit33/MySudoku)

  