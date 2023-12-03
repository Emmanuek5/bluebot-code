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
  const invite = await guild.invites.create(guild.systemChannelId, {
    unique: true,
    maxAge: 0,
  });
  console.log(`Invite link for ${guild.name}: ${invite.url}`);
  const embed = new EmbedBuilder()
    .setTitle(`**${guild.name}** Has Joined The Fold`)
    .setColor("#0099ff")
    .setURL(invite.url)
    .setDescription(`Join The Server And Surrort The Community ${invite.url}`)
    .setThumbnail(guild.iconURL())
    .setTimestamp();

  //Guild Chamnnel embed
  const myguild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
  const invite2 = await myguild.invites.create("1123343203081404587", {
    unique: true,
    maxAge: 0,
  });
  const embed2 = new EmbedBuilder()
    .setTitle(`Welcome **${guild.name}**.`)
    .setColor("#0099ff")
    .setURL(invite2.url)
    .setDescription(
      `Thanks For Adding The bot. Join The Server And Surrort The Community ${invite2.url}`
    )
    .setThumbnail(guild.iconURL())
    .setTimestamp()
    .setURL(invite2.url)
    .setFooter({
      text: `Server Invite Link: ${invite2.url}`,
      iconURL: process.env.BOT_AVATAR,
    });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("Join Our Server").setStyle("Link").setURL(invite2.url),
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

  let oid = guild.ownerId;
  let gggs = guild;

  try {
    const guild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
    const channel = guild.channels.cache.find(channel => channel.id === process.env.CHANNEL_ID);

    if (!channel) {
      throw new Error("Channel not found!");
    }

    console.log(channel);
    channel.send({ embeds: [embed] });

    systemChannel.send({ embeds: [embed2], components: [row] });

    dmhandler(client, guild, "serveradd", 0, oid, gggs);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  add,
};
