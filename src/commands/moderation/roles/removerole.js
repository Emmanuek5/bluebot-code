const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
  usage: 'removerole',
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Remove a reaction role')
    .setDMPermission()

    .addRoleOption((option) => option.setName('role').setDescription('The role to remove').setRequired(true)),
  async execute(interaction, client) {
    const { options, guildId, member } = interaction;
    const role = options.getRole('role');
    const ReactionRoleSchema = require('../../../models/roles.js');
    try {
      const data = await ReactionRoleSchema.findOne({
        GuildId: guildId,
      });

      if (!data) {
        return await interaction.reply({ content: 'This Server has no data' });
      }

      const roles = data.roles;
      const findRole = roles.find((x) => x.role === role.id);
      if (!findRole) {
        console.log('This role is not in the reaction roles');
        return await interaction.reply({ content: 'This role is not in the reaction roles' });
      }

      const filtered = roles.filter((x) => x.role !== role.id);
      data.roles = filtered;
      data.save();
    } catch (error) {}
  },
};
