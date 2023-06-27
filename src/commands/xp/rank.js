const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Levels = require("discord.js-leveling");

module.exports = {
  usage: "rank",
  description: "Shows your rank",
  category: "economy",
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get info about your rank")
    .addUserOption(option => option.setName("user").setDescription("The user to get info about")),
  async execute(interaction, client) {
    const { options, user, guildId } = interaction;

    const member = options.getUser("user") || user;

    const userlevel = await Levels.fetch(member.id, guildId);
    if (!userlevel) {
      interaction.reply({
        content: "Seems like this user has not earned any xp so far.",
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Rank")
        .setDescription(
          `**${member.username}** is level ${userlevel.level} and has ${userlevel.xp} xp!`
        )
        .setColor("Random")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR });

      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
