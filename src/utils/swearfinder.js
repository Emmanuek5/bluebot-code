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

function findSwearWords(message) {
  let content;
  if (typeof message === "string") {
    // If message is a string, assign it to the content variable
    content = message;
  } else if (message.content) {
    // If message has a content property, assign it to the content variable
    content = message.content;
  } else {
    // Unable to determine the content, return false
    return false;
  }
  const words = content.split(" ");
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

/**
 * Finds any swear words in the given message.
 *
 * @param {string} message - The message to search for swear words.
 * @return {boolean} - Returns true if a swear word is found, otherwise false.
 */
function findSwearWordsAI(message) {
  let content;
  if (typeof message === "string") {
    // If message is a string, assign it to the content variable
    content = message;
  } else if (message.content) {
    // If message has a content property, assign it to the content variable
    content = message.content;
  } else {
    // Unable to determine the content, return false
    return false;
  }
  const words = content.replace(/[^a-zA-Z ]/g, "").split(/[ \n]/); // split by space or newline
  console.log(words);
  for (const word of words) {
    for (const swearWord of swearWords) {
      if (word.toLowerCase() === swearWord.toLocaleLowerCase()) {
        const foundSwearWord = swearWord;

        return true, foundSwearWord;
      }
    }
  }
  return false; // no swear words found
}

function findBadLInks(message) {}

module.exports = { findSwearWords, findBadLInks, findSwearWordsAI };
