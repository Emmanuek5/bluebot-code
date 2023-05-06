const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  VoiceChannel,
  GuildEmoji,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  usage: 'Usage: /stop - Stops the current song playing',
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop music'),

  async execute(interaction, client) {
    const { member, guild } = interaction;
    const embed = new EmbedBuilder();

    if (member.voice.channel) {
      if (member.voice.channel.full) {
        embed
          .setTitle('The voice channel is full')
          .setColor('Red')
          .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
          .setTimestamp();

        return await interaction.reply({ embeds: [embed] });
      }
    }

    if (!member.voice.channel) {
      embed
        .setTitle('You need to be in a voice channel to use this command')
        .setColor('Red')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    let player = client.manager.players.get(guild.id);
    if (!player) {
      embed
        .setTitle('There is no music playing')
        .setColor('Red')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    if (player) {
      player.destroy();
      embed
        .setTitle('Music Stopped')
        .setColor('Red')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
