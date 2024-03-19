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
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === "welcome");
    if (!welcomeChannel) return; // No welcome channel found, cannot send welcome message
    channel = welcomeChannel;
  }

  const type = serverInfo.welcomeMessage.type;
  const Raw_message = serverInfo.welcomeMessage.text;

  let message = Raw_message; // Assign the raw message to the message variable

  // Replace placeholders with actual values
  for (let i = 0; i < placeholders.length; i++) {
    message = message.replace(placeholders[i], values[i]);
  }

  if (role) {
    // Fetch the role and check if it exists
    const roletoadd = member.guild.roles.cache.get(role);
    if (roletoadd) {
      // Add the role to the new member
      member.roles.add(roletoadd);
    } else {
      console.error(`Role with ID ${role} not found.`);
    }
  }

  if (type === "embed") {
    const embed = new EmbedBuilder();
    // Check if the message is not empty before setting it as the description
    if (message.length > 0) {
      embed.setDescription(message);
    }
    embed
      .setTitle("Welcome")
      .setColor("#00ff00")
      .setThumbnail(member.user.avatarURL())
      .setTimestamp();

    channel.send({ embeds: [embed] });
  } else if (type === "message") {
    // Check if the message is not empty before sending it
    if (message.length > 0) {
      channel.send(message);
    }
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
