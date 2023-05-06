const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  usage: 'Usage: /seek - Seek back or forward 10s in the song',
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek back or forward 10s in the song')
    .addSubcommand((subcommand) => subcommand.setName('forward').setDescription('Seek forward 10s in the song'))
    .addSubcommand((subcommand) => subcommand.setName('back').setDescription('Seek back 10s in the song'))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('time')
        .setDescription('Seek to a specific time in the song')
        .addStringOption((option) =>
          option.setName('time').setDescription('The time you want to seek to').setRequired(true)
        )
    ),
  async execute(interaction, client, args) {
    const { member, guild } = interaction;
    const subcommand = interaction.options.getSubcommand();
    const time = interaction.options.getString('time') || null;
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('forward').setLabel('Forward').setStyle('Primary'),
      new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Primary')
    );

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
        .setTitle('Nothing is playing')
        .setColor('Red')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'forward') {
      player.seek(player.position + 10000);
      embed
        .setTitle('Seeked forward 10s')
        .setColor('Random')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'back') {
      player.seek(player.position - 10000);
      embed
        .setTitle('Seeked back 10s')
        .setColor('Random')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'time') {
      const timeArray = time.split(':');
      let timeInMs = 0;
      if (timeArray.length === 3) {
        timeInMs += parseInt(timeArray[0]) * 3600000;
        timeInMs += parseInt(timeArray[1]) * 60000;
        timeInMs += parseInt(timeArray[2]) * 1000;
      }
      if (timeArray.length === 2) {
        timeInMs += parseInt(timeArray[0]) * 60000;
        timeInMs += parseInt(timeArray[1]) * 1000;
      }
      if (timeArray.length === 1) {
        timeInMs += parseInt(timeArray[0]) * 1000;
      }
      player.seek(timeInMs);
      embed
        .setTitle(`Seeked to ${time}`)
        .setColor('Random')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
