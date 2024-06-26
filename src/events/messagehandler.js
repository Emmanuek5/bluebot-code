const {
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  MessageType,
  MessageActivityType,
  userMention,
  PermissionFlagsBits,
  ChannelType,
  PermissionsBitField,
  RoleManager,
  Colors,
  AttachmentBuilder,
} = require("discord.js");
const discord = require("discord.js");
const levels = require("discord.js-leveling");
const { dmhandler } = require("./dmhandler");
const { MessageCommands } = require("./Messagecommands");
const inviteSchema = require("../models/invites.js");
const { findSwearWords, findLinks, findBadLInks } = require("..//utils/swearfinder.js");
const WarnSchema = require("../models/warn.js");
const { bully } = require("./bullyme");
const {
  sleep,
  getYoutubeDownloadLink,
  download,
  deletefile,
  rand,
  downloadtxt,
} = require("../functions/functions");
const warn = require("../models/warn.js");
const { AuthorizationError } = require("passport-discord");
const ytdl = require("ytdl-core");
const serverSchema = require("../models/server.js");
const { data } = require("../commands/general/image-gen");
const client = require("../..");
const rateSchema = require("../models/messages-rate");
const { filterResponseForSwearWords, humanFilter } = require("../utils/filter");
const { createPrompt } = require("./Utils/AiHandler");
/**
 *
 * @param {*} client
 * @param {discord.Message} message
 * @returns
 */
async function messages(client, message) {
  const { guild, member, content, channel, author } = message;
  let serverInfo = await serverSchema.findOne({
    guildID: message.guild.id,
  });
  const fs = require("fs");
  require("dotenv").config();
  const args = content.split(" ");
  const command = args.shift().toLowerCase();
  const { id } = author;
  const { username, iconURL } = author;
  const embed = new EmbedBuilder();
  const button = new ButtonBuilder();
  const row = new ActionRowBuilder();
  const { guilds } = client;
  const path = require("path");
  const { channels } = guilds;
  const fetch = require("fetch");
  const mentioncode = `<@${process.env.CLIENT_ID}>`;
  const alias = "b";

  const serverinfo = await serverSchema.findOne({ guildID: guild.id });
  if (content.startsWith(process.env.PREFIX)) {
    const prefix = process.env.PREFIX;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    MessageCommands(client, command, args, message);
    return;
  }

  if (message.content.includes(mentioncode)) {
    const args = message.content.slice(mentioncode.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    MessageCommands(client, command, args, message);
    return;
  }

  if (message.author.bot || !message.guild) return;

  if (channel.name.includes("gpt-consersation-")) {
    if (content.toLowerCase() == "close conversation") {
      channel.delete();
      return;
    }
    createPrompt(message, client);
  }
  serverInfo.bullyMeChannel = serverInfo.bullyMeChannel || "";
  if (message.channel.name === "bully-me" || message.channel.id == serverInfo.bullyMeChannel) {
    bully(client, message);
    return;
  }

  if (message.content.length > 3 && !findSwearWords(message) && serverInfo.leveling) {
    const random = Math.floor(Math.random() * 100) + 1;
    const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, random);

    if (hasLeveledUp) {
      const user = await levels.fetch(message.author.id, message.guild.id);

      dmhandler(client, message, "levelup", user.level);
      const levelingupChannel = guild.channels.cache.find(
        ch => ch.id === serverInfo.levelingChannel
      );

      if (!levelingupChannel) {
        const channel = guild.channels.cache.find(ch => ch.id === message.channel.id);

        const embed = new EmbedBuilder()
          .setTitle("Level Up!")
          .setDescription(`GG ${author}!, You Just Leveled Up to Level ${user.level}`)
          .setColor("Random")
          .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
          .setTimestamp()
          .setFooter({
            text: `Level Up By: ${username}`,
            iconURL: iconURL,
          });
        const sendEmbed = channel.send({ embeds: [embed] }).then(msg => {
          msg.react("🎉");
        });

        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Level Up!")
        .setDescription(`GG ${author}!, You Just Leveled Up to Level ${user.level}`)
        .setColor("Random")
        .setTimestamp()
        .setFooter({
          text: `Level Up By: ${username}`,
          iconURL: iconURL,
        });

      const sendEmbed = levelingupChannel.send({ embeds: [embed] }).then(msg => {
        msg.react("🎉");
      });
    } else {
    }
  }
  if (message.attachments.size > 0) {
    const user_levels = levels.fetch(message.author.id, message.guild.id);
    console.log(user_levels);
    if (user_levels.level < 65) {
      console.log("1000");
    }
  }

  if (content.includes("https://discord.gg/") && !content.includes("event")) {
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    const invite = content.split("https://discord.gg/")[1];
    const invitecode = invite.split(" ")[0];
    const inviteurl = `https://discord.gg/${invitecode}`;
    message.delete();

    const inviteembed = new EmbedBuilder()
      .setTitle("Invite Link Detected")
      .setDescription(
        `Hey ${author}, We Don't Allow Invite Links In This Server, Please Don't Do It Again!`
      )
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: `Invite Link Detected By: ${username}`,
        iconURL: iconURL,
      });

    channel.send({ embeds: [inviteembed] });
  }

  if (message.author.bot) return;

  if (findSwearWords(message)) {
    if (serverinfo.swearWords == true) {
      return;
    }
    if (message.channel.name === "bully-me" || message.channel.id == serverInfo.bullyMeChannel)
      return;
    channel.send(
      `${author} Swearing is not allowed in this server please refrain from doing so in the future or you will be Muted`
    );
    const warns = await WarnSchema.findOne({ UserId: id, GuildId: guild.id });

    if (!warns) {
      const newWarn = new WarnSchema({
        GuildId: guild.id,
        UserId: id,
        WarnCount: 1,
        WarnReason: "Swearing",
        WarnedBy: "The Blue Bot",
        WarnedAt: Date.now(),
      });

      await newWarn.save();
    } else {
      warns.WarnCount += 1;

      if (warns.WarnCount >= 5) {
        const member = client.guilds.cache.get(guild.id).members.cache.get(message.author.id);
        const role = guild.roles.cache.find(r => r.name === "Muted");
        if (!role) {
          guild.roles
            .create({
              name: "Muted",
              color: Colors.Blue,
              permissions: [],
              reason: "Muted Role",
            })
            .catch(console.error);
        }

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          warns.WarnCount = 0;
          await warns.save();
          return;
        }
        member.timeout(50000 * 10, "Muted For Saying Bad Words");
        const embed = new EmbedBuilder()
          .setDescription(`:white_check_mark: You Have Been Timed Out  For Saying Bad Words`)
          .setColor("Blue");

        const dmembed = new EmbedBuilder()
          .setDescription(
            `:white_check_mark: You Have Been Timed Out On ${message.guild.name} for 5 Mins For Saying Bad Words`
          )
          .setColor("Blue");

        member.send({ embeds: [dmembed] }).catch(err => {
          return;
        });
        channel.send({ embeds: [embed] });
        member.timeout(5000 * 10, "Done");
        member.roles.add(role);
        warns.WarnCount = 0;
        await warns.save();

        // after 5 minutes remove the role
        await sleep(50000);
        member.timeout(null, "Done");
        member.roles.remove(role);
        return;
      }

      await warns.save();
    }

    dmhandler(client, message, "badword");

    const currentxp = await levels.fetch(id, guild.id);
    if (!currentxp) {
    } else if (currentxp.xp < 100) {
      const newxp = currentxp.xp - 1;
      console.log(currentxp, newxp);
      await levels.appendXp(id, guild.id, newxp);
    } else {
      const newxp = currentxp.xp - 100;
      console.log(currentxp, newxp);
      await levels.appendXp(id, guild.id, newxp);
    }
  }

  //find the channel named bully-me and send a message to it

  if (findBadLInks(message)) {
    if (message.channel.name === "bully-me") bully(client, message);
  }
}

module.exports = { messages };
