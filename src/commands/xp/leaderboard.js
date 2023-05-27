const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');

module.exports = {
  usage: 'Leaderboard',
  data: new SlashCommandBuilder().setName('xp-leaderboard').setDescription('Shows the leaderboard'),
  async execute(interaction, client) {
    const { option, user, guildId } = interaction;

    const rank = await Levels.fetchLeaderboard(guildId, 10); //We grab top 10 users with most xp in the current server.

    if (rank.length < 1) return interaction.reply("Nobody's in leaderboard yet.");
    const leaderboard = await Levels.computeLeaderboard(client, rank, true); //We process the leaderboard.

    const mappedRank = leaderboard.map(
      (e) => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`
    ); //We map the outputs.

    const embed = new EmbedBuilder()
      .setTitle('Leaderboard')
      .setDescription(mappedRank.join('\n\n'))
      .setColor('Random')
      .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
      .setFooter({
        text: `Requested By: ${user.username}`,
        iconURL: user.iconURL,
      });

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
