const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  usage: "Shows a map of the server or Creates a map of the server",
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Shows a map of the server or Creates a map of the server"),
  async execute(interaction) {
    //get all the categories and cahnnels under them
    const categories = interaction.guild.channels.cache.filter(
      c => c.type === ChannelType.GuildCategory
    );
    const channels = interaction.guild.channels.cache.filter(
      c => c.type === ChannelType.GuildText || ChannelType.GuildVoice
    );

    const embed = new EmbedBuilder();
    embed.setTitle("Server Map");
    embed.setColor(0x00ae86);
    embed.setDescription("This is a map of the server");
    embed.setThumbnail(interaction.guild.iconURL());
    embed.setTimestamp();
    //for each category add a field with the category name and the channels under it without spaces
    categories.forEach(category => {
      let channelsUnderCategory = channels.filter(c => c.parentId === category.id);
      let channelsUnderCategoryString = "";
      channelsUnderCategory.forEach(channel => {
        channelsUnderCategoryString += channel.name + ", ";
      });
      channelsUnderCategoryString = channelsUnderCategoryString.slice(0, -2);

      embed.addFields({ name: category.name, value: channelsUnderCategoryString });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
