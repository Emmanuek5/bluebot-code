const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  usage: "Usage: /report - Reports a user",
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Reports a user")
    .addUserOption(option =>
      option.setName("user").setDescription("The user to report").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("The reason for the report").setRequired(true)
    ),
  async execute(interaction, args) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const channels = interaction.guild.channels.cache;
    const channel = channels.find(ch => ch.name === "reports");
    if (!channel) {
      const channel = await interaction.guild.channels.create({
        name: "reports",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      channel.send(`The User ${user} Hat Been Reported for ${reason}`);
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Report")
      .setDescription(`User ${user} has been reported for ${reason}`)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },
};
