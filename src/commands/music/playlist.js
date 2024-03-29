const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { rand } = require("../../functions/functions");
const playlistSchema = require("../../models/playlists");
const serverSchema = require("../../models/server");

module.exports = {
  usage:
    "Usage: /playlist <playlist> for example /playlist https://www.youtube.com/playlist?list=PL4o29bINVT4EG_y-k5jGoOu3-Am8Nvi10",
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Adds a playlist to the queue")
    .addSubcommand(subcommand =>
      subcommand
        .setName("create")
        .setDescription("Create a Playlist")
        .addStringOption(option =>
          option.setName("name").setDescription("Name of the playlist").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName("list").setDescription("List All Your Playlists")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("load")
        .setDescription("Load A Playlist")
        .addStringOption(option =>
          option.setName("name").setDescription("Playlist").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("info")
        .setDescription("Info About A Playlist")
        .addStringOption(option =>
          option.setName("name").setDescription("Playlist").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("add-song")
        .setDescription("Add A Song To a PLaylist")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("The Song Or Playlist You Want To Add")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("playlist")
            .setDescription("The Playlist You Want To Add To")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("remove-song")
        .setDescription("Remove A Song From A Playlist")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("The Song Or Playlist You Want To Remove")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("playlist")
            .setDescription("The Playlist You Want To Remove From")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("delete")
        .setDescription("Delete A Playlist")
        .addStringOption(option =>
          option.setName("name").setDescription("The Playlist You Want To Delete").setRequired(true)
        )
    ),
  async execute(interaction, client, args) {
    const embed = new EmbedBuilder();
    embed.setColor("Aqua");
    await interaction.deferReply();
    const { guild, member, options } = interaction;
    const user = {};
    const serverInfo = await serverSchema.findOne({
      guildID: guild.id,
    });
    const subcommand = interaction.options.getSubcommand();
    const option = options.getString("name") || options.getString("yt-url");

    if (subcommand === "create") {
      const playlistName = options.getString("name");
      const playlist = await playlistSchema
        .findOne({
          guildID: guild.id,
          name: playlistName,
        })
        .exec();
      if (playlist) {
        embed.setDescription("That playlist already exists");
        return interaction.editReply({ embeds: [embed] });
      }
      const newPlaylist = new playlistSchema({
        guildID: guild.id,
        name: playlistName,
        songs: [],
      });
      await newPlaylist.save();
      embed.setDescription(`Created playlist **${playlistName}**`);
      return interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "info") {
      const playlistName = option;
      const playlist = await playlistSchema.findOne({
        guildID: guild.id,
        name: playlistName,
      });
      if (!playlist) {
        embed.setDescription("That playlist does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      const fields = playlist.songs.map(song => ({
        name: song.name,
        value: song.url,
      }));
      embed.addFields(fields.length > 0 ? fields : { name: "Songs", value: "No Songs" });
      return interaction.editReply({ embeds: [embed] });
    }
    if (subcommand === "delete") {
      const playlistName = option;
      const playlist = await playlistSchema.findOne({
        guildID: guild.id,
        name: playlistName,
      });
      if (!playlist) {
        embed.setDescription("That playlist does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      await playlistSchema.deleteOne({
        guildID: guild.id,
        name: playlistName,
      });
      embed.setDescription(`Deleted playlist ${playlistName}`);
      return interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "list") {
      const playlists = await playlistSchema.find({
        guildID: guild.id,
      });
      if (!playlists) {
        embed.setDescription("You have no playlists");
        return interaction.editReply({ embeds: [embed] });
      }
      const fields = playlists.map(playlist => ({
        name: playlist.name,
        value: playlist.songs.length.toString(),
      }));
      embed.addFields(fields.length > 0 ? fields : { name: "Songs", value: "No Songs" });
      return interaction.editReply({ embeds: [embed] });
      return interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "load") {
      const playlist = await playlistSchema.findOne({
        guildID: guild.id,
        name: option,
      });
      if (!playlist) {
        embed.setDescription("That playlist does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      if (playlist.songs.length === 0) {
        embed.setDescription("That playlist is empty");
        return interaction.editReply({ embeds: [embed] });
      }
      if (playlist.songs.length > 0) {
        const player = client.manager.players.get(guild.id);
        if (!player) {
          const voiceChannel = member.voice.channel;
          if (!voiceChannel) {
            embed.setDescription("You need to be in a voice channel");
            return interaction.editReply({ embeds: [embed] });
          }
          const player = client.manager.create({
            guild: guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: interaction.channel.id,
          });
          player.connect();
          for (const song of playlist.songs) {
            const track = await client.manager.search(song.title);
            console.log(song);
            player.queue.add(track.tracks[0]);
          }
          player.play();
          embed.setDescription(`Loaded playlist ${playlist.name}`);
          return interaction.editReply({ embeds: [embed] });
        } else {
          player.queue = playlist.songs;
          console.log(player.queue);
          embed.setDescription(`Loaded playlist ${playlist.name}`);
          return interaction.editReply({ embeds: [embed] });
        }
      }
    }

    if (subcommand === "add-song") {
      const playlist = await playlistSchema.findOne({
        guildID: guild.id,
        name: options.getString("playlist"),
      });
      if (!playlist) {
        embed.setDescription("That playlist does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      const songinfp = await client.manager.search(option);
      if (!songinfp) {
        embed.setDescription("That song does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      const song = songinfp.tracks[0];
      playlist.songs.push(song);
      await playlist.save();
      embed.setDescription(`Added ${option} to ${playlist.name}`);
      return interaction.editReply({ embeds: [embed] });
    }

    if (subcommand === "remove-song") {
      const playlist = await playlistSchema.findOne({
        guildID: guild.id,
        name: options.getString("playlist"),
      });
      if (!playlist) {
        embed.setDescription("That playlist does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      const songinfp = await client.manager.search(option);
      if (!songinfp) {
        embed.setDescription("That song does not exist");
        return interaction.editReply({ embeds: [embed] });
      }
      const song = songinfp.tracks[0];
      const index = playlist.songs.find(
        songf =>
          songf.title === song.title && songf.author === song.author && songf.uri === song.uri
      );
      if (!index) {
        embed.setDescription("That song is not in the playlist");
        return interaction.editReply({ embeds: [embed] });
      }
      playlist.songs.splice(index, 1);
      await playlist.save();
      embed.setDescription(`Removed ${option} from ${playlist.name}`);
      return interaction.editReply({ embeds: [embed] });
    }
  },
};
