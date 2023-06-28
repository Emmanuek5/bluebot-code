const { findSwearWords } = require("../utils/swearfinder");

describe("findSwearWords", () => {
  it("should return false when message doesn't contain any swear words", () => {
    const message = "This is a clean message";
    const result = findSwearWords(message);
    expect(result).toBe(false);
  });
  it("should return true when message contains a swear word", () => {
    const message = "This message contains a swear word: damn";
    const result = findSwearWords(message);
    expect(result).toBe(true);
  });

  it("should return true and the found swear word when message contains multiple swear words", () => {
    const message = "This message contains multiple swear words: damn and shit";
    const result = findSwearWords(message);
    expect(result).toEqual([true, "damn"]);
  });
});
