const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const serverSchema = require('../../models/server');
require('dotenv').config();
module.exports = {
  usage: 'Add A Server to the bots Memory',
  data: new SlashCommandBuilder()
    .setName('add-server')
    .setDescription('Add A Server to the bots Memory')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild } = interaction;
    const { id, name, memberCount, ownerId } = guild;
    console.log(guild.name);
    const server = await serverSchema.findOne({
      guildID: id,
    });
    if (server) {
      const guild = await client.guilds.cache.get(id);
      await serverSchema.findOneAndUpdate(
        {
          guildID: id,
        },
        {
          guildIcon: guild.iconURL(),
          guildMemberCount: memberCount,
          guildName: name,
          guildOwner: ownerId,
        }
      );

      console.log(guild.name);
      const newguildinfo = JSON.stringify(guild);
      const embed = new EmbedBuilder()
        .setTitle(`${server.guildName} Details`)
        .setDescription(`${server.guildName} Has ${server.guildMemberCount} Members`)
        .addFields({ name: 'Created On', value: new Date(guild.createdAt).toISOString() })
        .setThumbnail(server.guildIcon)
        .setAuthor({
          name: process.env.BOT_NAME,
          iconURL: process.env.BOT_AVATAR,
        });

      interaction.editReply({ embeds: [embed] });
    }

    const newServer = new serverSchema({
      guildID: id,
      guildIcon: guild.iconURL(),
      guildMemberCount: guild.memberCount,
      guildName: guild.name,
      guildOwner: guild.ownerId,
    });
    await newServer.save();

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Has Been Added`)
      .setDescription('Details')
      .addFields(
        { name: 'Id', value: id, inline: true },
        { name: 'Name', value: guild.name, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true }
      )
      .setThumbnail(guild.iconURL() || process.env.BOT_AVATAR);
    interaction.editReply({ embeds: [embed] });
  },
};
