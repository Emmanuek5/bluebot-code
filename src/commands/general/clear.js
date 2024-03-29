const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear All The Messages In A Channel")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    const { channel } = interaction;

    try {
      let totalMessages = 0;
      let fetchedMessages;

      // Get the total number of messages in the channel
      await channel.messages.fetch({ limit: 1 }).then(messages => {
        totalMessages = messages.size;
      });

      if (totalMessages === 0) {
        return interaction.editReply({ content: "There are no messages to clear." });
      }

      // Delete messages in batches of 100 until all messages are deleted
      while (totalMessages > 0) {
        fetchedMessages = await channel.messages.fetch({ limit: Math.min(totalMessages, 100) });
        await channel.bulkDelete(fetchedMessages); // Delete the fetched messages
        totalMessages -= fetchedMessages.size;
      }

      interaction.reply({ content: "All messages have been cleared." });
    } catch (error) {
      console.error("Error occurred while clearing messages:", error);
      await interaction.reply({ content: "An error occurred while clearing messages." });
    }
  },
};
