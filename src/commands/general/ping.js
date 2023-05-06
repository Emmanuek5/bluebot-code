const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  usage: 'Returns the latency of the bot',
  data: new SlashCommandBuilder()
    .setName('ping')

    .setDescription('Pings the bot'),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('Ping of the Bot')
      .setDescription(
        `Bot Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`
      )
      .setColor('Random')
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
