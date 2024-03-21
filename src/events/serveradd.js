const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  ClientPresence,
  ActivityType,
  PermissionFlagsBits,
  PermissionsBitField,
  ChannelType,
  Status,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { dmhandler } = require("./dmhandler");

require("dotenv").config();
/**
 * Asynchronously adds a guild to the client.
 *
 * @param {Object} guild - The guild object to be added.
 * @param {Object} client - The client object.
 * @return {Promise<void>} A promise that resolves once the guild has been added.
 */
async function add(guild, client) {
  const owner = await guild.members.fetch(guild.ownerId);
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(`"${guild.name}" Has Added The Bot To Their Server`)
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

  let invite;
  try {
    invite = await guild.invites.create(guild.systemChannelId, {
      unique: true,
      maxAge: 0,
    });
  } catch (error) {
    console.error("Failed to create invite:", error);
  }

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Join The Server")
      .setStyle("Link")
      .setURL(invite ? invite.url : "")
  );

  //Guild Channel embed
  const myguild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
  let embed2 = new EmbedBuilder()
    .setTitle(`Welcome **${guild.name}**.`)
    .setColor("#0099ff")
    .setThumbnail(guild.iconURL())
    .setTimestamp()
    .setFooter({
      text: `Server Invite Link: ${invite ? invite.url : ""}`,
      iconURL: process.env.BOT_AVATAR,
    });

  if (invite) {
    embed2 = embed2
      .setURL(invite.url)
      .setDescription(
        `Thanks For Adding The bot. Join The Server And Support The Community ${invite.url}`
      );
  } else {
    embed2 = embed2.setDescription(
      "Thanks For Adding The bot. Support The Community by joining the server."
    );
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Join Our Server")
      .setStyle("Link")
      .setURL(invite ? invite.url : ""),
    new ButtonBuilder().setStyle("Link").setURL(process.env.URL).setLabel("Visit Our Website")
  );

  const systemChannel = guild.systemChannel;
  if (systemChannel) {
    await systemChannel.send({ embeds: [embed2], components: [row] });
  } else {
    console.log(
      `Cannot send message to guild "${guild.name}". This guild does not have a system channel.`
    );
  }

  let gggs = guild;

  try {
    const guild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
    const channel = guild.channels.cache.find(channel => channel.id === process.env.CHANNEL_ID);

    if (!channel) {
      throw new Error("Channel not found!");
    }

    channel.send({ embeds: [embed], components: [row1] });

    systemChannel.send({ embeds: [embed2], components: [row] });

    dmhandler(client, guild, "serveradd", 0, oid, gggs);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  add,
};
