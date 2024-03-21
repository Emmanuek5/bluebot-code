const { EmbedBuilder } = require("discord.js");

module.exports = {
  async execute(guild, client) {
    const config = require("../../config.json");
    const channel = client.channels.cache.get(config.leave_channel);
    const owner = await guild.members.fetch(guild.ownerId);
    const embed = new EmbedBuilder()
      .setColor(0x00ae86)
      .setAuthor({ name: "Blue Bot", iconURL: process.env.BOT_AVATAR })
      .setTimestamp()
      .setDescription(`**${guild.name}** has removed me from thier server`)
      .addFields(
        {
          name: "Server Name",
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: "Server ID",
          value: `${guild.id}`,
          inline: true,
        },
        {
          name: "Server Owner",
          value: `${owner.user.tag}`,
          inline: true,
        },
        {
          name: "Member Count",
          value: `${guild.memberCount}`,
          inline: true,
        }
      );

    channel.send({ embeds: [embed] });
  },
};
