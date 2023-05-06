const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
  usage: 'addrole',
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a reaction role')
    .setDMPermission()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addRoleOption((option) => option.setName('role').setDescription('The role to add').setRequired(true))
    .addStringOption((option) =>
      option.setName('description').setDescription('The description of the role').setRequired(true)
    )
    .addStringOption((option) => option.setName('emoji').setDescription('The emoji to react with').setRequired(true)),

  async execute(interaction, client) {
await interaction.deferReply();
    const ReactionRoleSchema = require('../../../models/roles.js');
    const { options, guildId, member } = interaction;
    const role = options.getRole('role');
    const description = options.getString('description');
    const emoji = options.getString('emoji');

    try {
      if (role.position >= member.roles.highest.position)
        return await interaction.editReply({
          content: 'I Dont Have The Permisions for that ',
          ephemeral: true,
        });
      const data = await ReactionRoleSchema.findOne({
        GuildId: guildId,
      });

      const newRole = {
        role: role.id,
        name: role.name,
        description: description || 'No Description',
        emoji: emoji || '❓',
      };

      if (data) {
        const roleData = data.roles.find((x) => x.role === role.id);
        if (roleData) {
          roleData = newRole;
        } else {
          data.roles.push(newRole);
        }
        data.save();
      } else {
        await new ReactionRoleSchema({
          GuildId: guildId,
          roles: [newRole],
        }).save();
      }
      await interaction.editReply({
        content: `Added ${role.name} to the reaction roles`,
        ephemeral: true,
      });
    } catch (error) {}
  },
};
