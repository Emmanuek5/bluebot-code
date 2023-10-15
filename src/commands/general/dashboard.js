const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");
const ServerSchema = require("../../models/server");
require("dotenv").config();

module.exports = {
  usage: "Usage: /dashboard - Creates a Link to the Dashboard for the Server Admin",
  data: new SlashCommandBuilder()
    .setName("dashboard")
    .setDescription("Creates a Link to the Dashboard"),
  async execute(interaction) {
    //check if the user is the owner of the server and if not, send a message
    if (interaction.member.id !== interaction.guild.ownerId) {
      const name = interaction.member.guild.name;
      const guildId = interaction.guildId;
      const owner = interaction.guild.ownerId;
      const server = await ServerSchema.findOne({
        serverid: guildId,
        name: name,
        owner: owner,
      });
      //if the server is not in the database, add it
      console.log(server);
      if (!server) {
        const server = await ServerSchema.create({
          serverid: guildId,
          name: name,
          owner: owner,
        });
        server.save();
      }
      const embed = new EmbedBuilder()
        .setTitle("Dashboard")
        .setDescription("You need to be the owner of the server to use this command")
        .setColor("Red");
      await interaction.reply({ embeds: [embed] });
      return;
    }
    const url = process.env.BOT_URL + "/dashboard";
    const guildid = interaction.guildId;
    const userid = interaction.user.id;
    const dashboard = `${url}/${guildid}`;
    const embed = new EmbedBuilder()
      .setTitle("Dashboard")
      .setDescription(`[Click Here](${dashboard}) to open the Dashboard`)
      .setColor("Purple")
      .setAuthor({
        name: process.env.BOT_NAME,
        url: process.env.BOT_URL,
        iconURL: process.env.BOT_AVATAR,
      })
      .setThumbnail(process.env.BOT_AVATAR);

    await interaction.reply({ embeds: [embed] });
  },
};
