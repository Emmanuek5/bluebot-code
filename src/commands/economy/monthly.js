const { SlashCommandBuilder } = require("discord.js");
const { Economy } = require("../../economy/base");

// Constants
const MONTHLY_MONEY_AMOUNT = 10000; // Amount of monthly money
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // Milliseconds in 30 days

module.exports = {
  data: new SlashCommandBuilder()
    .setName("monthly")
    .setDescription("Get your monthly money")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const { user, guild } = interaction;
      const eco = new Economy(guild);
      let ecoUser = await eco.findUser(user.id);

      if (!ecoUser) {
        return interaction.reply({
          content: "You don't have an economy profile yet. Create one with /economy",
          ephemeral: true,
        });
      }

      if (ecoUser.lastMonthly && ecoUser.lastMonthly + THIRTY_DAYS > Date.now()) {
        // If less than 30 days have passed since the last monthly collection
        const remainingTime = ecoUser.lastMonthly + THIRTY_DAYS - Date.now();
        const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        return interaction.reply({
          content: `You can claim your monthly money again in ${days}d ${hours}h ${minutes}m ${seconds}s`,
          ephemeral: true,
        });
      } else {
        ecoUser.lastMonthly = Date.now();
        ecoUser.Wallet += MONTHLY_MONEY_AMOUNT;
        await ecoUser.save();

        return interaction.reply({
          content: `You have claimed your monthly money of ${MONTHLY_MONEY_AMOUNT} units.`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error occurred while executing monthly command:", error);
      return interaction.reply({
        content: "An error occurred while processing the command. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
