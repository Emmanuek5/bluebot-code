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
        const remainingTime = ecoUser.lastDaily + TWENTY_FOUR_HOURS - Date.now();
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        let timeString = "";
        if (hours > 0) {
          timeString += `${hours}h `;
        }
        if (minutes > 0) {
          timeString += `${minutes}m `;
        }
        if (seconds > 0 || (hours === 0 && minutes === 0)) {
          timeString += `${seconds}s`;
        }

        return interaction.reply({
          content: `You can claim your daily money again in ${timeString}`,
          ephemeral: true,
        });
      }

      ecoUser.lastDaily = Date.now();
      ecoUser.Wallet += DAILY_MONEY_AMOUNT;
      await ecoUser.save();
    } catch (error) {
      console.error("Error occurred while executing daily command:", error);
      return interaction.reply({
        content: "An error occurred while processing the command. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
