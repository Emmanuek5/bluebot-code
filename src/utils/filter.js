const { findSwearWords, findSwearWordsAI } = require('./swearfinder');
const fs = require('fs');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, Colors } = require('discord.js');
const path = require('path');
const { channel } = require('diagnostics_channel');
function humanFilter(message) {
   
    if (findSwearWords(message)) {
        message.delete();
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription("Pls don't use swear words or ask for swear words");
        message.channel.send({ embeds: [embed], content: ":(" });
        return true;
    }
}

function aiFilter(response, msg) {
    const content =   response.data.choices[0].text
  if (findSwearWordsAI(content)) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setDescription("I Can't Answer Your Question, As This Would Go Against Discord's Rules :/"); 
    msg.edit({ embeds: [embed],content: ":" });
    return true;
  }
}

module.exports = {
  humanFilter,
  aiFilter,
};
