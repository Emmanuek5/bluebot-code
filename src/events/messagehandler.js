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
} = require('discord.js');
const discord = require('discord.js');
const levels = require('discord.js-leveling');
const { dmhandler } = require('./dmhandler');
const { MessageCommands } = require('./Messagecommands');
const inviteSchema = require('../models/invites.js');
const { findSwearWords, findLinks, findBadLInks } = require('..//utils/swearfinder.js');
const WarnSchema = require('../models/warn.js');
const { bully } = require('./bullyme');
const { sleep, getYoutubeDownloadLink, download, deletefile, rand, downloadtxt } = require('../functions/functions');
const warn = require('../models/warn.js');
const { AuthorizationError } = require('passport-discord');
const ytdl = require('ytdl-core');
const serverSchema = require('../models/server.js');
const { data } = require('../commands/general/image-gen');
const client = require('../..');
const rateSchema = require('../models/messages-rate');
const { aiFilter, humanFilter } = require('../utils/filter');

async function messages(client, message) {
  const { guild, member, content, channel, author } = message;
  const serverInfo = await serverSchema.findOne({
    guildID: message.guild.id,
  });
const fs = require("fs")
require("dotenv").config()
  const args = content.split(' ');
  const command = args.shift().toLowerCase();
  const { id } = author;
  const { username, iconURL } = author;
  const embed = new EmbedBuilder();
  const button = new ButtonBuilder();
  const row = new ActionRowBuilder();
  const { guilds } = client;
  const path = require("path")
  const { channels } = guilds;
  const fetch = require('fetch');
 const mentioncode = `<@${process.env.CLIENT_ID}>`
  const alias = 'b';
  if (content.startsWith(process.env.PREFIX)) {
    const command = content.split(' ')[0].slice(process.env.PREFIX.length);
    console.log(command);
    const args = content.split(' ').slice(1);
    MessageCommands(client, command, args, message);
    return;
  }

  const messageoptions = {
    id: message.id,
    createdTimestamp: message.createdTimestamp,
    author: id,
  };

  if (message.author.bot || !message.guild) return;

  if (channel.name.includes('gpt-consersation-')) {
    if (content.startsWith('https://')) {
      channel.send('Links are not allowed');
      message.delete();
      return;
    }
    if (content == 'close conversation') {
      await channel.delete();
    }
    const { Configuration, OpenAIApi } = require('openai');

    const configureration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
console.log(process.env.OPENAI_API_KEY);
    const openai = new OpenAIApi(configureration);

    if (
      content.toLowerCase().startsWith('generate image of') ||
      content.toLowerCase().startsWith('image of') ||
      content.toLowerCase().startsWith('generate an image of') ||
      content.toLowerCase().startsWith('generate image')
    ) {
      channel.send('The Blue  Bot is Thinking ... ').then(async (msg) => {
        const response = await openai.createImage({
          prompt: content,
          n: 1,
          size: '1024x1024',
        });
        const image_url = response.data.data[0].url;
     const results =await download(image_url);
     const attachment = new AttachmentBuilder(results, { name: `${content}${rand(0,99999)}.png` });
     msg.edit({
       content: `${content}`,
    })
    channel.send({
      files: [attachment]
    })
     await sleep(50000);
     deletefile(results);
  
       
      
      });

      return;
    }



async function downloadtxt(link) {
  //download the file from the link and save it locally to the downloads folder in data folder
  const filename = path.basename(link);
  const file = fs.createWriteStream(path.join(__dirname, "../data/downloads/" + filename));
  request(link).pipe(file);
  file.on("finish", () => {
    file.close();
  });
  await sleep(5000);
  const filepath = path.join(__dirname, "../data/downloads/" + filename + ".png");

  return filepath;
}

    if (message.attachments.size > 0) {
      const file = message.attachments.first().url;
      console.log(file);
      const url = await downloadtxt(file);
      if (!url.endsWith(".txt")) return;
      channel.send("The Blue Bot is Thinking...").then(async msg => {
        const filecontent = fs.readFileSync(url, "utf-8");
        console.log(filecontent.slice(1, 10));
        try {
          const a = humanFilter(message, msg);
          if (a) return;
          const res = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: filecontent,
            temperature: 0.5,
            max_tokens: 2048,
          });
          const nulls = aiFilter(res, msg);
          if (nulls) return;

          const adata = res.data.choices[0].text;
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit(`\`\`\`${data}\`\`\``);
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send(`\`\`\`${newdata2}\`\`\``);
            }
            channel.send(`\`\`\`${newdata}\`\`\``);
          } else {
            msg.edit(`\`\`\`${adata}\`\`\``);
          }
        } catch (error) {
          msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
          channel.send(error.data);
          console.log(error);
        }
      });

      return;
    }
   channel.send('The Blue  Bot is Thinking ... ').then(async (msg) => {
      try {
       const a =  humanFilter(message,msg)
        if (a) return;
        const res = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: content,
          temperature: 0.5,
          max_tokens: 2048,
        });
         const nulls = aiFilter(res, msg);
         if (nulls) return;
         
        const adata = res.data.choices[0].text;
        if (adata.length > 1999) {
          const data = adata.slice(0, 1900);
          msg.edit(`\`\`\`${data}\`\`\``);
          const newdata = adata.slice(1900, adata.length);
          if (newdata.length > 1990) {
            const newdata2 = newdata.slice(1990, newdata.length);
            channel.send(`\`\`\`${newdata2}\`\`\``);

          }
          channel.send(`\`\`\`${newdata}\`\`\``);
        } else {
          msg.edit(`\`\`\`${adata}\`\`\``);
        }
      } catch (error) {
        msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
        channel.send(error.data);
        console.log(error);
      }
    });
    return;
  }

  if (message.channel.name === 'bully-me' || message.channel.id == serverInfo.bullyMeChannel) {
    bully(client, message);
    return;
  }

  

  if (message.content.length > 3 && !findSwearWords(message)) {
    const random = Math.floor(Math.random() * 100) + 1;
    const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, random);

    if (hasLeveledUp) {
      const user = await levels.fetch(message.author.id, message.guild.id);

      dmhandler(client, message, 'levelup', user.level);
      const levelingupChannel = guild.channels.cache.find((ch) => ch.id === serverInfo.levelingChannel);

      if (!levelingupChannel) {
        const channel = guild.channels.cache.find((ch) => ch.id === message.channel.id);

        const embed = new EmbedBuilder()
          .setTitle('Level Up!')
          .setDescription(`GG ${author}!, You Just Leveled Up to Level ${user.level}`)
          .setColor('Random')
          .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
          .setTimestamp()
          .setFooter({
            text: `Level Up By: ${username}`,
            iconURL: iconURL,
          });
        const sendEmbed = channel.send({ embeds: [embed] }).then((msg) => {
          msg.react('🎉');
        });

        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Level Up!')
        .setDescription()
        .setColor('Random')
        .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({
          text: `Level Up By: ${username}`,
          iconURL: iconURL,
        });

      const sendEmbed = levelingupChannel.send({ embeds: [embed] }).then((msg) => {
        msg.react('🎉');
      });
    } else {
    }
  }

  if (content.includes('https://discord.gg/') && !content.includes('event')) {
    if (member.permissions.has(PermissionsBitField.Flags.Administrator )) return;
    const invite = content.split('https://discord.gg/')[1];
    const invitecode = invite.split(' ')[0];
    const inviteurl = `https://discord.gg/${invitecode}`;
    message.delete();

    const inviteembed = new EmbedBuilder()
      .setTitle('Invite Link Detected')
      .setDescription(`Hey ${author}, We Don't Allow Invite Links In This Server, Please Don't Do It Again!`)
      .setColor('Red')
      .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
      .setTimestamp()
      .setFooter({
        text: `Invite Link Detected By: ${username}`,
        iconURL: iconURL,
      });

    channel.send({ embeds: [inviteembed] });
  }

  if (message.author.bot) return;

  if (findSwearWords(message)) {
    const serverinfo = await serverSchema.findOne({ guildID: guild.id });
    if (serverinfo.swearWords == true) {
      return;
    }
    if (message.channel.name === 'bully-me' || message.channel.id == serverInfo.bullyMeChannel) return;
    message.delete();
    channel.send(
      `${author} Swearing is not allowed in this server please refrain from doing so in the future or you will be Muted`
    );
    const warns = await WarnSchema.findOne({ UserId: id, GuildId: guild.id });

    if (!warns) {
      const newWarn = new WarnSchema({
        GuildId: guild.id,
        UserId: id,
        WarnCount: 1,
        WarnReason: 'Swearing',
        WarnedBy: 'The Blue Bot',
        WarnedAt: Date.now(),
      });

      await newWarn.save();
    } else {
      warns.WarnCount += 1;

      if (warns.WarnCount >= 5) {
        const member = client.guilds.cache.get(guild.id).members.cache.get(message.author.id);
        const role = guild.roles.cache.find((r) => r.name === 'Muted');
        if (!role) {
          guild.roles
            .create({
              name: 'Muted',
              color: Colors.Blue,
              permissions: [],
              reason: 'Muted Role',
            })
            .catch(console.error);
        }

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          channel.send({ content: "I Can't Mute This User :sob:" });
          warns.WarnCount = 0;
          await warns.save();
          return;
        }
        member.timeout(50000 * 10, 'Muted For Saying Bad Words');
        const embed = new EmbedBuilder()
          .setDescription(`:white_check_mark: You Have Been Timed Out  For Saying Bad Words`)
          .setColor('Blue');

        const dmembed = new EmbedBuilder()
          .setDescription(
            `:white_check_mark: You Have Been Timed Out On ${message.guild.name} for 5 Mins For Saying Bad Words`
          )
          .setColor('Blue');

        member.send({ embeds: [dmembed] }).catch((err) => {
          return;
        });
        channel.send({ embeds: [embed] });
        member.timeout(5000 * 10, 'Done');
        member.roles.add(role);
        warns.WarnCount = 0;
        await warns.save();

        // after 5 minutes remove the role
        await sleep(50000);
        member.timeout(null, 'Done');
        member.roles.remove(role);
        return;
      }

      await warns.save();
    }

    dmhandler(client, message, 'badword');

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


  if (message.content.includes(mentioncode)) {
    channel.send(`Hey ${author}, How can i help? `)
    
  }
  //find the channel named bully-me and send a message to it

  if (findBadLInks(message)) {
    if (message.channel.name === 'bully-me') bully(client, message);
  }
}

module.exports = { messages };
