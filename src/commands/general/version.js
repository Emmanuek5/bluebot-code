const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { sleep } = require('../../functions/functions');

module.exports = {
  data: new SlashCommandBuilder().setName('version').setDescription("Gives the bot's version"),
  async execute(interaction, client) {
    await interaction.deferReply();

    const res = await fetch('https://rtisserver.ml/api/v1/bot/version');

    const response = await res.json();
    console.log(response);
    interaction.editReply({ content: response.version });
  },
};
