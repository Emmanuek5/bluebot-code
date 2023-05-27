const {
  joinVoiceChannel,
  entersState,
  createDefaultAudioReceiveStreamOptions,
} = require("@discordjs/voice");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");
   const Levels = require("discord.js-leveling");
const { sleep } = require("../functions/functions.js");
require("dotenv").config();
const commandSchema = require("../models/commands.js");
const { Configuration, OpenAIApi } = require("openai");
const ffmpeg = require("ffmpeg-static");
const fetch = require("fetch");
const ytdl = require("ytdl-core");
async function MessageCommands(client, command, args, message) {
  const { guild, member, content, channel, author } = message;
  const { id } = author;
  const { username, iconURL } = author;
  const embed = new EmbedBuilder();
  const button = new ButtonBuilder();
  const row = new ActionRowBuilder();
  const { guilds } = client;
  const { channels } = guild;
  const { roles } = guild;
  const { members } = guild;
  const path = require("path")
  console.log(command, args);

if (command === "watchtogether") {
  const {
    createAudioResource,
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
  } = require("@discordjs/voice");
  const { MessageEmbed } = require("discord.js");
  if (!args.length) {
    return message.channel.send("Please provide a YouTube video URL");
  }

  const svoiceChannel = message.member.voice.channel;
  if (!svoiceChannel) {
    return message.channel.send("Please join a voice channel first");
  }

  const connection = await joinVoiceChannel({
    channelId: svoiceChannel.id,
    guildId: svoiceChannel.guild.id,
    adapterCreator: svoiceChannel.guild.voiceAdapterCreator,
  });
  const audioResource = createAudioResource(
    `https://ia801008.us.archive.org/26/items/alicemertonnoroots_201907/Alice%20Merton%20-%20No%20Roots.mp3`
  );
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
  console.log(player)

  await player.play(audioResource);
  await connection.subscribe(player);
  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("YouTube Watch Together")
    .setDescription(`Starting a new YouTube Watch Together session`)
    .addFields({
      name: "URL",
      value: `https://www.youtube.com/watch?v=${args[0]}`,
    });

  channel.send({embeds : [embed]})

  player.on("error", (error) => {
    console.error(error);
  });

  player.on("finish", () => {
    voiceChannel.leave();
    message.channel.send("Watch Together session ended");
  });
}


  switch (command) {
    case "ping":
      //ping the bot and get the latency
      channel.send("Pinging...").then((msg) => {
        const ping = msg.createdTimestamp - message.createdTimestamp;
        msg.edit(`Bot Latency: ${ping}ms, API Latency: ${client.ws.ping}ms`);
      });

      break;
    case "help":
      const commands = await commandSchema.find();
      //get the first 20 commands
      const helpcommands = commands.slice(0, 20 );
      const helpembed = new EmbedBuilder()
        .setTitle("Help")
        .setDescription(`Commands for ${guild.name} \n **Note Most of these are slash commands**`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({ text: `Help Command By: ${username}`, iconURL: iconURL });
      //loop through the commands and add them to the embed
      helpcommands.forEach((command) => {
        helpembed.addFields({
          name: command.description,
          value: `\`\`\`${command.name}\`\`\`` ,
        });
      });

      channel.send({ embeds: [helpembed] });
      break;
    case "kick":
      const kickmember = message.mentions.members.first();
      const kickreason = args.slice(1).join(" ");
      if (!kickmember) return channel.send("Please mention a member to kick");
      if (!kickreason) return channel.send("Please provide a reason to kick");
      if (!member.permissions >= PermissionFlagsBits.KickMembers)
        return channel.send("You do not have permission to kick members");
      if (!kickmember.kickable)
        return channel.send("I do not have permission to kick this member");
      kickmember.kick({ reason: kickreason });
      const kickembed = new EmbedBuilder()
        .setTitle("Kicked")
        .setDescription(`Kicked ${kickmember} for ${kickreason}`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({ text: `Kick Command By: ${username}`, iconURL: iconURL });
      channel.send({ embeds: [kickembed] });
      break;
    case "play":
      const song = args.join(" ");

      const voiceChannel = member.voice.channel;
      if (!voiceChannel) return channel.send("Please join a voice channel");
      if (!voiceChannel.joinable)
        return channel.send(
          "I do not have permission to join this voice channel"
        );
      if (!voiceChannel.speakable)
        return channel.send(
          "I do not have permission to speak in this voice channel"
        );
      let player = client.manager.players.get(guild.id);
      if (!player) {
        player = client.manager.create({
          guild: guild.id,
          voiceChannel: member.voice.channel.id,
          textChannel: channel.id,
          selfDeafen: false,
        });
      }

      if (player.paused) {
        player.pause(false);
     const  embesd = new EmbedBuilder()
         .setDescription("Song Resumed")
         
        channel.send({ embeds: [embesd] });
        return;
      }
      if (!song) return channel.send("Please provide a song to play");
      const songs = await client.manager.search(song);

      player.connect();

      player.queue.add(songs.tracks[0]);
      //get the duration of the song and convert it to a string
     let dur;
     if (songs.tracks[0].duration < Number.MAX_SAFE_INTEGER) {
       dur = new Date(songs.tracks[0].duration).toISOString().slice(11, 19);
     } else {
       dur = "00000";
     }

      const { title, author, duration, uri } = songs.tracks[0];

      if (player.queue.size > 0) {
        const embed = new EmbedBuilder();
        player.queue.add(songs.tracks[0]);

        embed
          .setTitle("Song Added to Queue")
          .setDescription(`[${title}](${uri})`)
          .addFields(
            { name: "Author", value: author, inline: true },
            { name: "Duration", value: dur, inline: true }
          )
          .setColor("Purple")
          .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
          .setTimestamp()
          .setThumbnail(songs.tracks[0].thumbnail);
        await channel.send({ embeds: [embed] });
      }
      if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
        const embed = new EmbedBuilder();

        embed
          .setTitle("Song Added to Queue")
          .setDescription(`[${title}](${uri})`)
          .addFields(
            { name: "Author", value: author, inline: true },
            { name: "Duration", value: dur, inline: true }
          )
          .setColor("Purple")
          .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
          .setTimestamp()
          .setThumbnail(songs.tracks[0].thumbnail);
        await channel.send({ embeds: [embed] });
      }

      break;
    case "stop":
      const stopplayer = client.manager.players.get(guild.id);
      if (!stopplayer) return channel.send("There is no song playing");
      stopplayer.destroy();
      const stopembed = new EmbedBuilder()
        .setTitle("Stopped")
        .setDescription(`Stopped the song`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({ text: `Stop Command By: ${username}`, iconURL: iconURL });
      channel.send({ embeds: [stopembed] });
      break;
    case "pause":
      const pauseplayer = client.manager.players.get(guild.id);
      if (!pauseplayer) return channel.send("There is no song playing");
      pauseplayer.pause(true);
      const pauseembed = new EmbedBuilder()
        .setTitle("Paused")
        .setDescription(`Paused the song`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({ text: `Pause Command By: ${username}`, iconURL: iconURL });
      channel.send({ embeds: [pauseembed] });
      break;
    case "resume":
      const resumeplayer = client.manager.players.get(guild.id);
      if (!resumeplayer) return channel.send("There is no song playing");
      resumeplayer.pause(false);
      const resumeembed = new EmbedBuilder()
        .setTitle("Resumed")
        .setDescription(`Resumed the song`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({
          text: `Resume Command By: ${username}`,
          iconURL: iconURL,
        });
      channel.send({ embeds: [resumeembed] });
      break;
    case "queue":
      const queueplayer = client.manager.players.get(guild.id);
      if (!queueplayer) return channel.send("There is no song playing");
             
             
              const embedss = new EmbedBuilder();
              const newdur = new Date(queueplayer.queue.duration).toISOString().slice(11,19)
              embedss
         .setTitle(`The Playlist is ${newdur} `)

                .setColor("Purple")
                .setAuthor({
                  name: "The Blue Bot",
                  iconURL: process.env.BOT_AVATAR,
                })
                .setTimestamp()
                .setThumbnail(song.thumbnail);
                 queueplayer.queue.forEach((song, index) => {
                   const dur = new Date(song.duration)
                     .toISOString()
                     .slice(11, 19);
                   const { title, author, duration, uri } = song;
                   embedss.addFields(
                     { name: "Author", value: author, inline: true },
                     { name: "Duration", value: dur, inline: true }
                   );
                 });
              channel.send({ embeds: [embedss] });
     
      break;
    case "skip":
      const skipplayer = client.manager.players.get(guild.id);
      if (!skipplayer) return channel.send("There is no song playing");
      skipplayer.stop();
      const skipembed = new EmbedBuilder()
        .setTitle("Skipped")
        .setDescription(`Skipped the song`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({ text: `Skip Command By: ${username}`, iconURL: iconURL });
      channel.send({ embeds: [skipembed] });
      break;
    case "volume":
      const volumeplayer = client.manager.players.get(guild.id);
      if (!volumeplayer) return channel.send("There is no song playing");
      if (!args[1]) return channel.send("Please provide a volume");
      if (isNaN(args[1])) return channel.send("Please provide a valid number");
      if (args[1] > 100)
        return channel.send("Please provide a number between 1 and 100");
      volumeplayer.setVolume(args[1]);
      const volumeembed = new EmbedBuilder()
        .setTitle("Volume")
        .setDescription(`Set the volume to ${args[1]}`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({
          text: `Volume Command By: ${username}`,
          iconURL: iconURL,
        });
      channel.send({ embeds: [volumeembed] });
      break;
    case "seek":
      const seekplayer = client.manager.players.get(guild.id);
      if (!seekplayer) return channel.send("There is no song playing");
      const embed = new EmbedBuilder();
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("song-forward")
          .setLabel("Forward")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("song-back")
          .setLabel("Back")
          .setStyle("Primary")
      );
      embed
        .setTitle("Seek")
        .setDescription(`Seek the song`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({ text: `Seek Command By: ${username}`, iconURL: iconURL });
      channel.send({ embeds: [embed], components: [row] });
      break;
    case "controls":
      const embedcont = new EmbedBuilder();
      const rowcont = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("song-play")
          .setLabel("Play")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("song-pause")
          .setLabel("Pause")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("song-skip")
          .setLabel("Skip")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("song-volume")
          .setLabel("Volume Up")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("song-volume-down")
          .setLabel("Volume Down")
          .setStyle("Primary")
      );
      embedcont
        .setTitle("Controls")
        .setDescription(`Controls for the music`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({
          text: `Controls Command By: ${username}`,
          iconURL: iconURL,
        });
      channel.send({ embeds: [embedcont], components: [rowcont] });
      break;
    case "download":
      const song_url = args[1];
      if (!song_url) return channel.send("Please provide a song url");
      //get the video iid from the url
      const video_id = song_url.split("v=")[1];
      //get the download link for the video
      const download_link = `https://www.youtube.com/watch?v=${video_id}`;

      break;
    case "search":
      const query = args.slice(1).join(" ");
      const url = "https://api.openai.com/v1/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };
      const data = {
        prompt: `Search for ${query}`,
        max_tokens: 1000,
        temperature: 0.9,
        model: "text-davinci-003",
      };
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      const json = await response.json();

      const searchembed = new EmbedBuilder()
        .setTitle("Search")
        .setDescription(`Searched for ${query} `)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()

        .setFooter({
          text: `Search Command By: ${username}`,
          iconURL: iconURL,
        })
        //make the result be slightly darker than the embed color so it looks better
        .addFields([
          {
            name: "Result:",
            value: "```" + json.choices[0].text + "```",
            inline: true,
          },
        ]);
      channel.send({ embeds: [searchembed] });

      break;
    case "models":
      const url2 = "https://api.openai.com/v1/models";
      const headers2 = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };
      const response2 = await fetch(url2, {
        method: "GET",
        headers: headers2,
      });
      const json2 = await response2.json();

      const models = json2.data.map((model) => model.id);
      const newmodel = models.splice(0, 20);
      const modelsembed = new EmbedBuilder()
        .setTitle("Models")
        .setDescription(`Models`)
        .setColor("Random")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();
      newmodel.forEach((model) => {
        modelsembed.addFields({ name: model, value: " " });
      });
      modelsembed.setFooter({
        text: `Models Command By: ${username}`,
        iconURL: iconURL,
      });
      channel.send({ embeds: [modelsembed] });
      break;
    case "rank":
   
      const user = message.mentions.users.first() || message.author;

      const userlevel = await Levels.fetch(user.id, message.guild.id);
      if (!userlevel) {
        message.reply({
          content: "Seems like this user has not earned any xp so far.",
          ephemeral: true,
        });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Rank")
          .setDescription(
            `**${username}** is level ${userlevel.level} and has ${userlevel.xp} xp!`
          )
          .setThumbnail(process.env.BOT_AVATAR)
          .setColor("Random")
          .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR });

        message.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      break;
    case "leaderboard":

      const rank = await Levels.fetchLeaderboard(guild.id, 10); //We grab top 10 users with most xp in the current server.

      if (rank.length < 1) return message.reply("Nobody's in leaderboard yet.");
      const leaderboard = await Levels.computeLeaderboard(client, rank, true); //We process the leaderboard.

      const mappedRank = leaderboard.map(
        (e) =>
          `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
            e.level
          }\nXP: ${e.xp.toLocaleString()}`
      ); //We map the outputs.
     const leadembed = new EmbedBuilder()
       .setTitle("Leaderboard")
       .setDescription(mappedRank.join("\n\n"))
       .setColor("Random")
       .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
       .setFooter({
         text: `Requested By: ${username}`,
         iconURL: iconURL,
       });

       message.channel.send({embeds: [leadembed]})
      break;
        case "joke":     
    const joke = await fetch(process.env.JOKE_API);
    const jokejson = await joke.json();
    const { setup, delivery } = jokejson;
    channel.send(setup).then(async (msg) => {
      const mgg = msg;
      await sleep(3000).then(() => {

        mgg.edit(delivery);
      });
    });
    break;
    case "meme":
       async function redditMeme() {
          const response =   await fetch('https://www.reddit.com/r/memes/random/.json')
            const meme = await response.json();

            const embed = new EmbedBuilder()
                .setTitle(meme[0].data.children[0].data.title)
                .setURL(`https://reddit.com${meme[0].data.children[0].data.permalink}`)
                .setImage(meme[0].data.children[0].data.url)
                .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
                .setFooter({text: `👍 ${meme[0].data.children[0].data.ups} | 💬 ${meme[0].data.children[0].data.num_comments}`})
                .setTimestamp()
            return message.reply({embeds: [embed]});

            
        }

        async function giphyMeme() {
            const response = await fetch('https://api.giphy.com/v1/gifs/random?api_key=yCCeJ38QdVX56QpnxgH8fZScUVR0m7S5&tag=meme&rating=g');
            const meme = await response.json();

            const embed = new EmbedBuilder()
                .setTitle(meme.data.title)
                .setURL(meme.data.url)
                .setImage(meme.data.images.original.url)
                .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
                .setFooter({text: `👍 ${meme.data.import_datetime} | 💬 ${meme.data.username}`})
                .setTimestamp()
            return message.reply({embeds: [embed]});


         
        }
        
        if(platform === 'reddit') {
            redditMeme();
        }
        else if(platform === 'giphy') {
            giphyMeme();
        }
        else {
            const random = Math.floor(Math.random() * 2);
            console.log(random);
            if(random === 0) {
                redditMeme();
            }
            else if(random === 1) {
                giphyMeme();
            }
        } 
        break;
        
  


  }
}

// Path: src/events/Messagecommands.js
module.exports = { MessageCommands };
