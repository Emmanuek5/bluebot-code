const { findSwearWords, findSwearWordsAI } = require("./swearfinder");
const { MessageEmbed } = require("discord.js");

async function humanFilter(message) {
  if (findSwearWords(message)) {
    try {
      await message.delete();

      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setDescription("Please don't use swear words or ask for swear words");

      await message.channel.send({ embeds: [embed], content: ":(" });
    } catch (error) {
      console.error("Error while filtering human message:", error);
    }
    return true;
  }
}

async function filterResponseForSwearWords(response, msg) {
  const content = response.data.choices[0].text;
  if (findSwearWordsAI(content)) {
    try {
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setDescription("I can't answer your question as this would go against Discord's rules :/");

      await msg.edit({ embeds: [embed], content: ":" });
    } catch (error) {
      console.error("Error while filtering AI response:", error);
    }
    return true;
  }
}

module.exports = {
  humanFilter,
  filterResponseForSwearWords,
};
