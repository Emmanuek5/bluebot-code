const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { findSwearWords } = require("../../../utils/swearfinder.js");

module.exports = {
  usage: "Usage: /badwords find all bad words in a server",
  data: new SlashCommandBuilder()
    .setName("badwords")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("Find all bad words in a server"),
  async execute(interaction) {
    const { guild } = interaction;
    interaction.deferReply();
    const { channels } = guild;
    const textChannels = channels.cache.filter(c => c.type === ChannelType.GuildText);
    const swearWords = [];
    for (const channel of textChannels) {
      const messages = await channel[1].messages.fetch({ limit: 10 });
      for (const message of messages) {
        if (findSwearWords(message[1])) {
          swearWords.push(message[1].content);
        } else {
        }
      }
    }

    if (swearWords > 100) {
      const newSwearWords = swearWords[(1, 100)];
      const embed = new EmbedBuilder()
        .setTitle("Bad Words")
        .setDescription(swearWords.join("\n"))
        .setColor("Random")
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
        })
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });
      const row = new ActionRowBuilder();
      new ButtonBuilder().setStyle("Primary").setCustomId("badwords-next").setLabel("Next >");

      interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Bad Words")
      .setDescription(swearWords.join("\n"))
      .setColor("Random")
      .setTimestamp()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });
    interaction.editReply({ embeds: [embed] });
  },
};
