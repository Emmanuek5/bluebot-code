const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Economy } = require("../../economy/base");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell an  item in your inventory")
    .addStringOption(option =>
      option.setName("item").setDescription("Item to sell").setRequired(true)
    )
    .addNumberOption(option =>
      option.setName("amount").setDescription("Amount to sell").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild, options, user } = interaction;
    const item = options.getString("item");
    const userId = user.id.toString();
    const eco = client.economy;
    const ecoUser = await eco.findUser(userId);
    if (!ecoUser) {
      return interaction.reply({
        content: "You don't have an economy profile yet",
        ephemeral: true,
      });
    }
    const itemData = ecoUser.inventory.find(inventoryItem => inventoryItem.name === item);

    if (!itemData) {
      return interaction.reply({
        content: "You don't have that item in your inventory",
      });
    }

    if (itemData.amount < options.getNumber("amount")) {
      return interaction.editReply({
        content: "You dont have that many " + item + "'s in your inventory",
      });
    }

    ecoUser.Wallet += itemData.price * options.getNumber("amount");
    const result = eco.InventorySystem.buyItem(
      process.env.CLIENT_ID,
      userId,
      itemData,
      options.getNumber("amount")
    );
    ecoUser.save();

    if (result) {
      const embed = new EmbedBuilder()
        .setTitle(`Successfully Sold ${options.getNumber("amount")} ${item}`)
        .setDescription(
          `You sold ${options.getNumber("amount")} ${item} for $${
            itemData.price * options.getNumber("amount")
          }`
        )
        .setColor("Green")
        .setTimestamp()
        .setFooter({ text: "Sell" });
      return interaction.editReply({ embeds: [embed] });
    } else {
      return interaction.editReply({ content: "Something went wrong" });
    }
  },
};
