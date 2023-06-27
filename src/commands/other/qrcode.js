const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { readQRCode, generateQRCode } = require("../../utils/qrcode");
const { download } = require("../../functions/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qrcode")
    .setDescription("Generate Or Read QR Codes")
    .addSubcommand(subcommand =>
      subcommand
        .setName("generate")
        .setDescription("Generate QR Code")
        .addStringOption(option =>
          option
            .setName("text")
            .setDescription("The text to be converted to QR Code")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("read")
        .setDescription("Read QR Code")
        .addAttachmentOption(option =>
          option.setName("attachment").setDescription("The QR Code to be read").setRequired(true)
        )
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand();
    try {
      if (command === "generate") {
        const text = interaction.options.getString("text");
        const image = await generateQRCode(text);
        const attachment = new AttachmentBuilder(image, { name: "qrcode.png" });
        const embed = new EmbedBuilder()
          .setTitle("QR Code Generator")
          .setColor("Green")
          .setImage("attachment://qrcode.png")
          .setFooter({ text: "Made By The Obsidian Group" });
        await interaction.editReply({ files: [attachment], embeds: [embed] });
      } else if (command === "read") {
        const attachment = interaction.options.getAttachment("attachment");
        const filePath = await download(attachment.url);
        const text = await readQRCode(filePath);
        const embed = new EmbedBuilder()
          .setTitle("QR Code Reader")
          .setColor("Green")
          .setDescription("The Qr Code Text is" + text)
          .setFooter({ text: "Made By The Obsidian Group" });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
