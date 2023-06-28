const { SlashCommandBuilder, PermissionsBitField, MessageCollector } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear All The Messages In A Channel")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild } = interaction;
    const channel = interaction.channel;
    channel.messages.fetch({ limit: 100 }).then(async messages => {
      await interaction.editReply({
        content: `Received ${messages.size} messages`,
      });

      console.log(`Received ${messages.size} messages`);
      //Iterate through the messages here with the variable "messages".
      messages.forEach(message => message.delete());
    });
  },
};
