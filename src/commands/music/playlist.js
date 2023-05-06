const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { rand } = require('../../functions/functions');
const playlistSchema = require('../../models/playlists');
const serverSchema = require('../../models/server');

module.exports = {
  usage:
    'Usage: /playlist <playlist> for example /playlist https://www.youtube.com/playlist?list=PL4o29bINVT4EG_y-k5jGoOu3-Am8Nvi10',
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Adds a playlist to the queue')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Create a Playlist')
        .addStringOption((option) => option.setName('name').setDescription('Name of the playlist').setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName('list').setDescription('List A Users Playlists'))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('load')
        .setDescription('Load A Users Playlist Into The Queue')
        .addStringOption((option) => option.setName('yt-url').setDescription('Playlist').setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add-song')
        .setDescription('Add A Song To a PLaylist')
        .addStringOption((option) =>
          option.setName('playlist').setDescription('The Playlist To Add The Song To').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('song').setDescription('The Song Or Playlist You Want To Add').setRequired(true)
        )
    ),

  async execute(interaction, client, args) {
    console.log(playlistSchema);
    const embed = new EmbedBuilder();

    await interaction.deferReply();

    const { guild, member, options } = interaction;
    const user = {}
    const serverInfo = await serverSchema.findOne({
      guildID: guild.id,
    });
    const subcommand = interaction.options.getSubcommand();
    const option = options.getString('name') || options.getString('yt-url');
    console.log(option);

    if (subcommand == 'create') {
      let user = await playlistSchema.findOne({
        userId: interaction.user.id,
      });
      if (!user) {
        const newUser = new playlistSchema({
          userId: interaction.user.id,
          playlists: [],
        });
        await newUser.save();

        user = newUser;
      }
      const playlist = {
        id: rand(0, 999999),
        name: option,
        duration: 1,
        songs: [],
      };
      user.playlist.push(playlist);
      await user.save();

      const embed = new EmbedBuilder()
        .setDescription(`New Playlist Added :${option}`)
        .setTimestamp()
        .setColor(serverInfo.serverColor);

      await interaction.editReply({ embeds: [embed] });
    }
    if (subcommand == 'list') {

      if (!member.voice.channel) {
        embed
          .setTitle('You need to be in a voice channel to use this command')
          .setColor('Red')
          .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        return;
      }
    

     }
      if (subcommand == 'load') {
        if (member.voice.channel) {
          if (member.voice.channel.full) {
            embed
              .setTitle('The voice channel is full')
              .setColor('Red')
              .setAuthor({
                name: 'The Blue Bot',
                iconURL: process.env.BOT_AVATAR,
              })
              .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            return;
          }
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

        const res = await client.manager.search(option);

        if (res.loadType === 'NO_MATCHES') {
          embed
            .setTitle('There were no results found')
            .setColor('Red')
            .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
        } else if (res.loadType === 'LOAD_FAILED') {
          embed
            .setTitle('There was an error loading your playlist')
            .setColor('Red')
            .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
            .setTimestamp();

          return await interaction.editReply({ embeds: [embed] });
        } else if (res.loadType === 'PLAYLIST_LOADED') {
          
    player.connect();
          player.queue.add(res.tracks);
        player.play() 
          embed
            .setTitle('Playlist added to queue')

            .setColor('Random')
            .setAuthor({ name: 'The Blue Bot', iconURL: process.env.BOT_AVATAR })
            .setTimestamp();

          return await interaction.editReply({ embeds: [embed] });
        }
      }

      
     
    if (subcommand == 'add-song') {
      const song = options.getString('song');
      const playlisttoadd = options.getString('playlist');
      const playlist = user.playlist.find((x) => x.name.toLowerCase() == playlisttoadd.toLowerCase());
      if (!playlist) {
        await interaction.editReply({
          content: "You Don't Have A Playlist With That Name :sob:",
        });
      }
      const res = await client.manager.search(playlist);
      console.log(playlist);

      playlist.songs.push(res);
      user.playlist.interaction.editReply({
        content: `Song/Playlist Added To ${playlist.name}`,
      });
    }
  },
};
