const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  usage: "Pauses the current song playing in the voice channel",
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current song"),
  async execute(interaction, client) {
    const { guild } = interaction;
    const player = client.manager.players.get(guild.id);
    const embed = new EmbedBuilder();
    if (!player) {
      embed
        .setTitle("There is nothing playing")
        .setColor("Red")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
    if (player.paused) {
      embed
        .setTitle("The player is already paused")
        .setColor("Red")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
    player.pause(true);
    embed
      .setTitle("Song Paused")
      .setColor("Random")
      .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
