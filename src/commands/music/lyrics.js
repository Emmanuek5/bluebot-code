const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { Colors } = require("discord.js");
const { getThumbnail, getLyrics } = require("@fantox01/lyrics-scraper");
const apiKey = "HtrnVyrrhWx762NVDY6eE2TYO3einsghCvqJlLlXZjt7kIEg-R3jFoCtuK0jTwn_";
module.exports = {
  data: new SlashCommandBuilder().setName("lyrics").setDescription("Get lyrics for a song"),
  async execute(interaction, client) {
    const { user } = interaction;
    const player = client.manager.get(interaction.guildId);
    console.log(player);
    if (!player) return interaction.reply("There is no Music playing in this server");

    if (player.queue.current) {
      const { title, author, thumbnail } = player.queue.current;
      const lyrics = await getLyrics(title.replace("(Official Music Video)", ""));
      if (!lyrics) {
        interaction.reply("No lyrics found for this song");
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(title)
        .setAuthor({ name: author, iconURL: thumbnail })
        .setDescription(lyrics)
        .setThumbnail(thumbnail)
        .setFooter({ text: `Requested by ${user.username}` });
      interaction.reply({ embeds: [embed] });
    }
  },
};
