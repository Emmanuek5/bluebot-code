const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { options } = require("../../routes/web");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addemoji")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEmojisAndStickers)
    .setDescription("Adds Am Emoji To A Server")
    .addAttachmentOption(option =>
      option.setName("emoji").setDescription("The Emoji").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("name").setDescription("The Name Of The Emoji").setRequired(true)
    ),
  async execute(interaction, client) {
    const upload = interaction.options.getAttachment("emoji");
    const name = interaction.options.getString("name");
    const i = interaction.reply({ content: ":arrows_clockwise:  Uploading Your Emoji" });

    const emoji = await interaction.guild.emojis
      .create({ attachment: `${upload.attachment}`, name: `${name}` })
      .catch(err => {
        setTimeout(async () => {
          console.log(err);
          await interaction.editReply({ content: `Error: ${err.rawError.message}` });
        }, 2000);
      });

    setTimeout(async () => {
      if (!emoji) return;
      const embed = new EmbedBuilder()
        .setTitle("Emoji Added")
        .setDescription(`Successfully Added ${emoji} To The Server`)
        .setColor("Green")
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    }, 2000);
  },
};
