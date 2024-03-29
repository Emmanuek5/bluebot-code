const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const ecoSChema = require("../../models/economy.js");
const { Colors } = require("discord.js");
const { Economy } = require("../../economy/base");

module.exports = {
  data: new SlashCommandBuilder().setName("inventory").setDescription("Check Your Inventory"),
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const eco = client.economy;
    let Data = await eco.findUser(user.id);

    if (!Data) {
      return interaction.reply({
        content: "You dont have an economy profile yet",
        ephemeral: true,
      });
    }
    const inventory = await eco.getUserItems(user.id);
    if (inventory.length === 0) {
      return interaction.reply({
        content: "You dont have any items in your inventory",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Inventory")
      .setDescription("Check Your Inventory");
    for (const item of inventory) {
      embed.addFields({
        name: item.name,
        value: ` Price: $${item.price} \n Amount: ${item.amount}`,
      });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
