const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { sleep } = require("../../functions/functions");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder().setName("version").setDescription("Gives the bot's version"),
  async execute(interaction, client) {
    await interaction.deferReply();


    interaction.editReply({ content: process.env.VERSION });
  },
};
