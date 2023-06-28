const fs = require("fs");
const path = require("path");
const swearWords = [];
const swearWordsfile = fs
  .readFileSync(path.join(__dirname, "../data/swearwords.txt"), "utf-8")
  .split("\n");
const { Colors } = require("discord.js");
for (const swearWord of swearWordsfile) {
  swearWord.toLocaleLowerCase();
  swearWords.push(swearWord);
}

/**
 * Finds swear words in a message.
 *
 * @param {string} message - The message to search for swear words.
 * @returns {boolean|string} - Returns true if a swear word is found, otherwise false.
 */
function findSwearWords(message) {
  const words = message.content.split(" ");
  for (const word of words) {
    for (const swearWord of swearWords) {
      if (word.toLowerCase() === swearWord.toLocaleLowerCase()) {
        const foundSwearWord = swearWord;

        return true, foundSwearWord;
      }
    }
  }
  return false;
}

function findSwearWordsAI(message) {
  const words = message.replace(/[^a-zA-Z ]/g, "").split(/[ \n]/); // split by space or newline
  console.log(words);
  for (const word of words) {
    for (const swearWord of swearWords) {
      if (word.toLowerCase() === swearWord.toLocaleLowerCase()) {
        const foundSwearWord = swearWord;

        return true, foundSwearWord;
      }
    }
    return false, null; // no swear words found
  }
}
function findBadLInks(message) {}



module.exports = { findSwearWords, findBadLInks, findSwearWordsAI };
