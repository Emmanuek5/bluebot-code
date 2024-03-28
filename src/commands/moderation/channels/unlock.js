const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
  Client,
  CommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks A Channel")
    .setDefaultPermission(false)
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("The Channel To Unlock")
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

      const everyoneRole = guild.roles.cache.find(role => role.name === "@everyone");
      if (!everyoneRole) {
        return await interaction.reply({
          content: "Unable to find @everyone role in the server",
          ephemeral: true,
        });
      }

      if (channel.permissionsFor(everyoneRole).has(PermissionsBitField.Flags.SendMessages)) {
        return await interaction.reply({
          content: "This channel is already unlocked",
          ephemeral: true,
        });
      }

      await channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: true,
      });

      await interaction.reply({
        content: `✅ ${channel} has been unlocked successfully.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error occurred while executing unlock command:", error);
      await interaction.reply({
        content: "An error occurred while processing the command. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
