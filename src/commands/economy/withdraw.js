const { SlashCommandBuilder, Colors } = require("discord.js");
const { Economy } = require("../../economy/base");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw money from your bank")
    .addNumberOption(option =>
      option.setName("amount").setDescription("The amount of money to withdraw").setRequired(true)
    ),
  async execute(interaction) {
    const { user, guild } = interaction;
    const amount = interaction.options.getNumber("amount");
    const eco = client.economy;
    const ecoUser = await eco.findUser(user.id);

    if (!ecoUser) {
      return interaction.reply({
        content: "You dont have an economy profile yet",
        ephemeral: true,
      });
    }

    if (amount % 1 != 0 || amount <= 0) {
      await interaction.reply({
        content: "Please enter a valid whole number greater than 0",
        ephemeral: true,
      });
      return;
    }

    if (amount > ecoUser.Bank) {
      await interaction.reply({
        content: "You dont have that much money in your bank",
      });
      return;
    }

    ecoUser.Wallet += amount;
    ecoUser.Bank -= amount;
    await ecoUser.save();

    const embed = new EmbedBuilder();
    embed.setDescription(`You have withdrawn ${amount} from your bank`);
    embed.setColor(Colors.Green);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
