const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear All The Messages In A Channel")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    const { channel } = interaction;

    try {
      // Get the total number of messages in the channel
      const totalMessages = (await channel.messages.fetch({ limit: 100 })).size;

      if (totalMessages === 0) {
        return interaction.reply({ content: "There are no messages to clear." });
      }

      // Calculate the number of batches required to clear all messages
      const batchCount = Math.ceil(totalMessages / 100);

      // Delete messages in batches of 100
      for (let i = 0; i < batchCount; i++) {
        const fetchedMessages = await channel.messages.fetch({ limit: 100 });
        await channel.bulkDelete(fetchedMessages);
      }

      interaction.reply({ content: "All messages have been cleared." });
    } catch (error) {
      console.error("Error occurred while clearing messages:", error);
      await interaction.reply({ content: "An error occurred while clearing messages." });
    }
  },
};
