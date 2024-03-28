const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
  Client,
  CommandInteraction,
} = require("discord.js");

module.exports = {
  usage: "lock",
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks A Channel")
    .setDefaultPermission(false)
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("The Channel To Lock")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    try {
      const { options, guild } = interaction;
      const channel = options.getChannel("channel");

      if (!channel || channel.type !== ChannelType.GUILD_TEXT) {
        return await interaction.reply({
          content: "Please provide a valid text channel",
          ephemeral: true,
        });
      }

      const everyoneRole = guild.roles.cache.find(role => role.name === "@everyone");
      if (!everyoneRole) {
        return await interaction.reply({
          content: "Unable to find @everyone role in the server",
          ephemeral: true,
        });
      }

      if (!channel.permissionsFor(everyoneRole).has(PermissionsBitField.FLAGS.SEND_MESSAGES)) {
        return await interaction.reply({
          content: "This channel is already locked",
          ephemeral: true,
        });
      }

      await channel.permissionOverwrites.edit(everyoneRole, {
        SEND_MESSAGES: false,
      });

      await interaction.reply({
        content: `✅  ${channel} has been locked successfully.`,
      });
    } catch (error) {
      console.error("Error occurred while executing lock command:", error);
      await interaction.reply({
        content: "An error occurred while processing the command. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
