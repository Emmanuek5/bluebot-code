const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  VoiceChannel,
  GuildEmoji,
} = require("discord.js");

module.exports = {
  usage: "Usage: /volume <volume> - Change volume of the current song playing",
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change volume")
    .addIntegerOption(option =>
      option.setName("volume").setDescription("Volume to set").setRequired(true)
    ),
  async execute(interaction, client, args) {
    const { member, guild } = interaction;
    const volume = interaction.options.getInteger("volume") || args[1];
    const embed = new EmbedBuilder();
    const player = client.manager.players.get(guild.id);
    if (!player) {
      embed
        .setTitle("There is nothing playing")
        .setColor("Red")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }
    if (volume > 100 || volume < 0) {
      embed
        .setTitle("Volume must be between 0 and 100")
        .setColor("Red")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }
    player.setVolume(volume);
    embed
      .setTitle(`Volume set to ${volume}`)
      .setColor("Purple")
      .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },
};
