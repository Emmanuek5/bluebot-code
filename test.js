const player = client.manager.players.get(guild.id);
const embed = new EmbedBuilder();
if (!player) {
  embed
    .setTitle("There is nothing playing")
    .setColor("Red")
    .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
}

const playlist = interaction.options.getString("playlist") || args[1];
const res = await client.manager.search(playlist);

if (res.loadType === "NO_MATCHES") {
  embed
    .setTitle("There were no results found")
    .setColor("Red")
    .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
} else if (res.loadType === "LOAD_FAILED") {
  embed
    .setTitle("There was an error loading your playlist")
    .setColor("Red")
    .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
    .setTimestamp();

  return await interaction.reply({ embeds: [embed] });
} else if (res.loadType === "PLAYLIST_LOADED") {
  player.queue.add(res.tracks);
  embed
    .setTitle("Playlist added to queue")

    .setColor("Random")
    .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
    .setTimestamp();

  return await interaction.editReply({ embeds: [embed] });
}

//////////////////////
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const playlistSchema = require("../../models/playlists");

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
    ),
  async execute(interaction, client, args) {
    await interaction.deferReply();
    const { guild, member } = interaction;
    const subcommand = interaction.options.getSubcommand();
    const option = interaction.options.getString("name");

    if (subcommand == "create") {
      const user = await playlistSchema.findOne({
        userId: interaction.user.id,
      });
      if (!user) {
        const newUser = new playlistSchema({
          userId: interaction.user.id,
        });
        await newUser.save();
      }
    }
  },
};
