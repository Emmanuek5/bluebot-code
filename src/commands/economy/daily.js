const { SlashCommandBuilder } = require("discord.js");
const { Economy } = require("../../economy/base");

// Constants
const DAILY_MONEY_AMOUNT = 100; // Amount of daily money
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // Milliseconds in 24 hours

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Get your daily money")
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

      if (ecoUser.lastDaily && ecoUser.lastDaily + TWENTY_FOUR_HOURS > Date.now()) {
        // If less than 24 hours have passed since the last daily collection
        const remainingTime = ecoUser.lastDaily + TWENTY_FOUR_HOURS - Date.now();
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        return interaction.reply({
          content: `You can claim your daily money again in ${hours}h ${minutes}m ${seconds}s`,
          ephemeral: true,
        });
      } else {
        ecoUser.lastDaily = Date.now();
        ecoUser.Wallet += DAILY_MONEY_AMOUNT;
        await ecoUser.save();

        return interaction.reply({
          content: `You have claimed your daily money of ${DAILY_MONEY_AMOUNT} units.`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error occurred while executing daily command:", error);
      return interaction.reply({
        content: "An error occurred while processing the command. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
