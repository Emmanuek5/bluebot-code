const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  SelectMenuBuilder,
  StringSelectMenuBuilde,
  PermissionsBitField,
} = require('discord.js');
    

module.exports = {
  usage: 'Usgae: /planel  ',
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Create a reaction role panel')
    .setDMPermission(),
  async execute(interaction, client) {
    const { guildId, member, guild, channel } = interaction;
    try {
      const ReactionRoleSchema = require('../../../models/roles.js');
      const data = await ReactionRoleSchema.findOne({
        GuildId: guildId,
      });

      if (!data.roles.length > 0) {
        return await interaction.reply({
          content: 'This Server has no data',
         
        });
      }
      const roles = data.roles;
      console.log(roles);
      const embed = new EmbedBuilder()
        .setTitle('Reaction Roles')
        .setDescription('Select a role to get it')
        .setColor('Random');
      const options = data.roles.map((x) => {
        return {
          label: x.name,
          description: x.description,
          value: x.role,
          emoji: x.emoji,
        };
      });

      const menuComponent = [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('roles')
            .setPlaceholder('Select a role')
            .setMaxValues(options.length)
            .addOptions(options)
        ),
      ];
    
   await    interaction.reply({ embeds: [embed],
        components: menuComponent});
    } catch (error) {}
  },
};
