const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  usage: "Plays a song in the voice channel or continues the song if it is paused ",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song in the voice channel")
    .addStringOption(option =>
      option.setName("song").setDescription("The song you want to play").setRequired(false)
    ),

  async execute(interaction, client, args) {
    const { member, guild } = interaction;
    const song = interaction.options.getString("song");
    const embed = new EmbedBuilder();
    //reduce the amount of time it to run the command
    if (member.voice.channel) {
      if (member.voice.channel.full) {
        embed
          .setTitle("The voice channel is full")
          .setColor("Red")
          .setAuthor({ name: "Blue Bot", iconURL: process.env.BOT_AVATAR })
          .setTimestamp();

        return await interaction.reply({ embeds: [embed] });
      }
    }

    if (!member.voice.channel) {
      embed
        .setTitle("You need to be in a voice channel to use this command")
        .setColor("Red")
        .setAuthor({ name: "Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    let player = client.manager.players.get(guild.id);
    if (!player) {
      player = client.manager.create({
        guild: guild.id,
        voiceChannel: member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: false,
      });
    }

    if (player.paused) {
      player.pause(false);
      embed
        .setTitle("Song Resumed")

        .setColor("Purple")
        .setAuthor({ name: "Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      return await interaction.reply({ embeds: [embed] });
    }

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
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setThumbnail(songs.tracks[0].thumbnail);
      await interaction.reply({ embeds: [embed] });
    }

    if (song === null) {
      embed
        .setTitle("You need to specify a song to play")
        .setColor("Red")
        .setAuthor({ name: "Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    if (!player.playing && !player.paused && !player.queue.size) player.play();

    embed
      .setTitle("Song Added to Queue")
      .setDescription(`[${title}](${uri})`)
      .addFields(
        { name: "Author", value: author, inline: true },
        { name: "Duration", value: dur, inline: true }
      )
      .setColor("Purple")
      .setAuthor({ name: "Blue Bot", iconURL: process.env.BOT_AVATAR })
      .setTimestamp()
      .setThumbnail(songs.tracks[0].thumbnail);

    return await interaction.reply({ embeds: [embed] });
    //get the errror and send it to the user
  },
};
