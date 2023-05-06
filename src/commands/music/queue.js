const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  usage: 'Usage: /queue use this command to see the song queue of the current server',
  data: new SlashCommandBuilder().setName('queue').setDescription('Shows the queue of the current song'),
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const player = client.manager.players.get(guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('There is nothing playing')
            .setColor('Red')
            .setAuthor({
              name: 'The Blue Bot',
              iconURL: process.env.BOT_AVATAR,
            })
            .setTimestamp(),
        ],
      });
    }
    const queue = player.queue;

    const dd = new Date(queue.duration).toISOString().slice(11, 19);
    const embed = new EmbedBuilder()

      .setTitle(`The Queue is ${dd} Long`)
      .setColor('Purple')
      .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
      .setTimestamp();
    const { songs } = queue;
    if (queue.length > 24) {
      const songList = queue.slice(0, 24);
      songList.forEach((song, index) => {
        embed.addFields({
          name: `${index + 1}. ${song.title}`,
          value: `${song.author} | ${new Date(song.duration).toISOString().slice(11, 19)}`,
        });
      });
      return interaction.reply({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('queue-next').setLabel('Next >').setStyle('Primary')
          ),
        ],
      });
    } else {
      queue.forEach((song, index) => {
        embed.addFields({
          name: `${index + 1}. ${song.title}`,
          value: `${song.author} | ${new Date(song.duration).toISOString().slice(11, 19)}`,
        });
      });
      return interaction.reply({ embeds: [embed] });
    }
  },
};
