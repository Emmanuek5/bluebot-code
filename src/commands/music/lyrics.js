const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { Colors } = require("discord.js");
const { getLyrics, getSong } = require("genius-lyrics-api");
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
      const options = {
        apiKey,
        title: title,
        artist: author,
        optimizeQuery: true,
      };

      getLyrics(options).then(lyrics => {
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setAuthor({ name: author, iconURL: thumbnail })
          .setDescription(lyrics)
          .setColor(Colors.Blue)
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
    }
  },
};
