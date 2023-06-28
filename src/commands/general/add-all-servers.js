const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const serverSchema = require("../../models/server");
require("dotenv").config();
module.exports = {
  usage: "Add A Server to the bots Memory",
  data: new SlashCommandBuilder()
    .setName("add-all-server")
    .setDescription("Add A Server to the bots Memory")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    await interaction.deferReply();
    if (interaction.user.id !== "738471887902081064") {
      await interaction.editReply({ content: " Your Not The Owner of the bot" });
    }

    client.guilds.cache.forEach(guild => {
      // Create a new server object
      const newServer = new serverSchema({
        guildID: guild.id,
        guildName: guild.name,
        guildIcon: guild.iconURL(),
        guildMemberCount: guild.memberCount,
        guildOwner: guild.ownerId,
      });

      newServer.save(err => {
        if (err) console.error(err);
        else console.log(`Added server ${guild.name} to the database`);
      });
    });

    await interaction.editReply({ content: "Done" });
  },
};
