const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music-controls")
    .setDescription("Displays the music controls"),
  async execute(client, interaction) {
    const username = interaction.user.username;
    const embedcont = new EmbedBuilder();
    const rowcont = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("song-play").setLabel("Play").setStyle("Primary"),
      new ButtonBuilder().setCustomId("song-pause").setLabel("Pause").setStyle("Primary"),
      new ButtonBuilder().setCustomId("song-skip").setLabel("Skip").setStyle("Primary"),
      new ButtonBuilder().setCustomId("song-volume").setLabel("Volume Up").setStyle("Primary"),
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
        iconURL: interaction.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embedcont], components: [rowcont] });
  },
};
