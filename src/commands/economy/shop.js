const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("@discordjs/builders");
const ecoSChema = require("../../models/economy.js");
const { Colors } = require("discord.js");
const { Economy } = require("../../economy/base");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder().setName("shop").setDescription("Get the items in the shop"),
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const eco = client.economy;
    let Data = eco.getShop();

    let fields = [];
    Data.forEach(item => {
      fields.push({ name: item.name, value: `Price: $${item.price}` });
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Shop")
      .setDescription("Items in the shop")
      .addFields(fields.slice(0, 15))
      .setFooter({ text: "Page 1/2" });
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("shop-next").setLabel("Next >>").setStyle("Primary")
    );

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
