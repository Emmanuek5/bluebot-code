const { Client, EmbedBuilder } = require("discord.js");
const { dmhandler } = require("./dmhandler");
const serverSchema = require("../models/server.js");

async function join(client, member) {
  const serverInfo = await serverSchema.findOne({
    guildID: member.guild.id,
  });

  const channel = member.guild.channels.cache.find(ch => ch.id === serverInfo.welcomeChannel);
  if (!channel) {
    const channel = member.guild.channels.cache.find(ch => ch.name === "welcome");
    if (!channel) return;
    const embed = new EmbedBuilder();
    embed
      .setTitle("Welcome")
      .setDescription(`Welcome, ${member.user.username}!`)
      .setColor("#00ff00")
      .setThumbnail(member.user.avatarURL())
      .setTimestamp();
    dmhandler(client, member.user, "welcome", member.guild);
    channel.send({ embeds: [embed] });
  }

  const embed = new EmbedBuilder();
  embed
    .setTitle("Welcome")
    .setDescription(`Welcome, ${member.user.username}!`)
    .setColor("#00ff00")
    .setThumbnail(member.user.avatarURL())
    .setTimestamp();
  dmhandler(client, member.user, "welcome", member.guild);
  channel.send({ embeds: [embed] });
}

async function leave(client, member) {
  const serverInfo = await serverSchema.findOne({
    guildID: member.guild.id,
  });

  const channel = member.guild.channels.cache.find(ch => ch.id === serverInfo.welcomeChannel);

  if (!channel) {
    const channel = member.guild.channels.cache.find(ch => ch.name === "goodbye");
    if (!channel) return;
    const embed = new EmbedBuilder();
    embed
      .setTitle("Goodbye")
      .setDescription(`Goodbye, ${member.user.username}!`)
      .setColor("#ff0000")
      .setThumbnail(member.user.avatarURL())
      .setTimestamp();
    dmhandler(client, member.user, "goodbye", member.guild);

    channel.send({ embeds: [embed] });
  }
  const embed = new EmbedBuilder();
  embed
    .setTitle("Goodbye")
    .setDescription(`Goodbye, ${member.user.username}!`)
    .setColor("#ff0000")
    .setThumbnail(member.user.avatarURL())
    .setTimestamp();
  dmhandler(client, member.user, "goodbye", member.guild);

  channel.send({ embeds: [embed] });
}

module.exports = {
  join: join,
  leave: leave,
};
