const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  SelectMenuBuilder,
  StringSelectMenuBuilder,
  PermissionsBitField,
} = require('discord.js');
    

module.exports = {
  usage: 'Usgae: /planel  ',
  data: new SlashCommandBuilder()
    .setName('roles-panel')
    .setDescription('Create a reaction role panel')
    .setDMPermission(),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guildId, member, guild, channel } = interaction;
    try {
      const ReactionRoleSchema = require('../../../models/roles.js');
      const data = await ReactionRoleSchema.findOne({
        GuildId: guildId,
      });

      if (!data.roles.length > 0) {
        return await interaction.editReply({
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
    


      channel.send({ embeds: [embed], components: menuComponent });
   await  interaction.editReply({ content: 'Created the panel' });
    } catch (error) {
      console.log(error);
    }
  },
};
