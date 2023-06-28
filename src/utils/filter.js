const { findSwearWords, findSwearWordsAI } = require("./swearfinder");
const { EmbedBuilder } = require("discord.js");

/**
 * Filters a message to remove any swear words and sends a warning message if swear words are found.
 *
 * @param {string} message - The message to be filtered.
 * @return {boolean} Returns true if swear words are found and the message is filtered, otherwise false.
 */
async function humanFilter(message) {
  // Check if swear words are found in the message
  if (findSwearWords(message)) {
    try {
      // Delete the message
      await message.delete();

      // Create an embed message to show a warning
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("Please don't use swear words or ask for swear words");

      // Send the warning message in the same channel
      await message.channel.send({ embeds: [embed], content: ":(" });
    } catch (error) {
      // Log any error that occurs while filtering the message
      console.error("Error while filtering human message:", error);
    }
    return true;
  } else {
    return false;
  }
}

/**
 * Filters the response for swear words and takes appropriate action if any are found.
 *
 * @param {Object} response - The response object that contains the data to be filtered.
 * @param {Object} msg - The message object to be edited if swear words are found.
 * @return {boolean} Returns true if swear words are found in the response, otherwise returns undefined.
 */
async function filterResponseForSwearWords(response, msg) {
  // Extract the content from the response object
  const content = response.data.choices[0].text;
  if (findSwearWordsAI(content)) {
    try {
      // Create a new embedded message with a red color and a description explaining the situation
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("I can't answer your question as this would go against Discord's rules :/");

      // Edit the message object with the new embed and a placeholder content
      await msg.edit({
        embeds: [embed],
        content: ":",
      });
    } catch (error) {
      // Log and rethrow any errors that occur during the filtering process
      console.error("Error while filtering AI response:", error);
      throw error;
    }

    // Return true to indicate that swear words were found
    return true;
  } else {
    return false;
  }
}

module.exports = {
  humanFilter,
  filterResponseForSwearWords,
};
