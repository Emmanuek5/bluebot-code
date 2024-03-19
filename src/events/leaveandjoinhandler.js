const { Client, EmbedBuilder, GuildMember } = require("discord.js");
const { dmhandler } = require("./dmhandler");
const serverSchema = require("../models/server.js");

/**
 * Function to send a welcome message to a new member joining the server.
 *
 * @param {Client} client - The Discord client
 * @param {GuildMember} member - The member who joined the server
 * @return {void} - No return value
 */
async function join(client, member) {
  const serverInfo = await serverSchema.findOne({
    guildID: member.guild.id,
  });

  const placeholders = ["{user}", "{server}", "{count}"];
  const values = [member.user.tag, member.guild.name, member.guild.memberCount];

  if (!serverInfo || !serverInfo.welcomeMessage || !serverInfo.welcomeMessage.enabled) {
    return;
  }

  const role = serverInfo.welcomeMessage.role;

  const channel = member.guild.channels.cache.find(ch => ch.id === serverInfo.welcomeChannel);
  if (!channel) {
    // If welcome channel is not found, try finding a channel named "welcome"
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === "welcome");
    if (!welcomeChannel) return; // No welcome channel found, cannot send welcome message
    channel = welcomeChannel;
  }

  const type = serverInfo.welcomeMessage.type;
  const Raw_message = serverInfo.welcomeMessage.text;
  const message = Raw_message.replace(
    placeholders.reduce((acc, cur, i) => acc.replace(cur, values[i]), Raw_message)
  );

  if (role) {
    //fetch the role and give it to the new member
    const roletoadd = member.guild.roles.cache.find(r => r.id === role);
    member.roles.add(roletoadd);
  }

  if (type === "embed") {
    const embed = new EmbedBuilder();
    embed
      .setTitle("Welcome")
      .setDescription(message)
      .setColor("#00ff00")
      .setThumbnail(member.user.avatarURL())
      .setTimestamp();

    //give role to new member

    channel.send({ embeds: [embed] });
  } else if (type === "message") {
    channel.send(message);
  }
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
