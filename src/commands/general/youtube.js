// create a new command called youtube that will return a link to the youtube channel

const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const serverSchema = require("../../models/server");

module.exports = {
  usage: "Usage: /youtube - Returns the link to the youtube channel set by the server owner",
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("Returns a link to the youtube channel"),
  async execute(interaction) {
    const data = await serverSchema.findOne({ guildID: interaction.guildId });

    if (data.youtubeChannel === null) {
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Youtube")
        .setDescription("No youtube channel has been set")
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }
    if (data.serverColor == "undefined") {
      data.serverColor = "#0099ff";
    }

    const youtubeEmbed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle("Youtube Channel")
      .setThumbnail(process.env.BOT_AVATAR)
      .setDescription(`Click [here](${data.youtubeChannel}) to go to the youtube channel`)
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
      .setTimestamp();
    return interaction.reply({ embeds: [youtubeEmbed] });
  },
};
