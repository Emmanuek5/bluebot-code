const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  usage: 'Usage: /skip - Skips the current song playing',
  data: new SlashCommandBuilder().setName('skip').setDescription('Skips the current song'),
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const player = client.manager.players.get(guild.id);
    if (!player) {
      const embed = new EmbedBuilder();
      embed
        .setTitle('There is nothing playing')
        .setColor('Red')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }
    //Check the queue for the next song and if there is none, stop the player and leave the channel else play the next song
    if (player.queue.size > 0) {
      player.stop();
    } else {
      player.destroy();
    }
    const embed = new EmbedBuilder();
    embed
      .setTitle('Song Skipped')
      .setColor('Purple')
      .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },
};
