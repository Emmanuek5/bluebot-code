const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, Colors } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Get help with commands"),
  async execute(interaction, client) {
    const { user, guild } = interaction;
    let commands = client.commands;
    let components = [];
    let fields = [];

    let count = 0;
    for (const [name, command] of commands) {
      if (count >= 25) break; // Limit to 20 commands
      fields.push({ name: command.data.name, value: command.data.description, inline: true });
      count++;
    }

    if (commands.size > 25) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("commands-next").setLabel("Next >>").setStyle("Primary")
      );
      components.push(row);
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Help")
      .setDescription("List of commands")
      .addFields(fields)
      .setFooter({ text: "Page 1/2" });

    interaction.reply({ embeds: [embed], components: components });
  },
};
