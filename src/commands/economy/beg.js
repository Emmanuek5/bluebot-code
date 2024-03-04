const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const ecoSChema = require("../../models/economy.js");
const { Colors } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("beg").setDescription("Beg For Money"),
  async execute(interaction) {
    const { user, guild } = interaction;

    let Data = await ecoSChema.findOne({ User: user.id });

    const negative = Math.round(Math.random() * -300) - 10;
    const positive = Math.round(Math.random() * 300) + 10;

    const posN = [negative, positive];

    const amount = Math.floor(Math.random() * posN.length);
    const value = posN[amount];

    if (!value) return interaction.reply({ content: "No Money For You Today", ephemeral: true });

    if (Data && value > 0) {
      Data.Wallet += value;
      Data.save();
    }

    if (value > 0) {
      const positiveChoices = [
        "You Got Money!",
        "Mr Beast Donated To You",
        "Free Money For You",
        "You Got Some Money",
        "Today is your lucky day",
        "Somebody gave you money",
      ];

      const positiveChoice = positiveChoices[Math.floor(Math.random() * positiveChoices.length)];

      const embed = new EmbedBuilder()
        .setTitle("Beggar")
        .setColor(Colors.Blue)
        .setDescription(`**${positiveChoice}\n\nYou Got $${value} Coins**`);

      await interaction.reply({ embeds: [embed] });
    } else {
      const negativeChoices = [
        "CLose, But No Cigar",
        "No Money Today",
        "Try Again Next Time ",
        "Dont Worry, You Will Get It",
        "You Lost Some Money",
        "You Lost Some Money",
      ];

      const negativeChoice = negativeChoices[Math.floor(Math.random() * negativeChoices.length)];

      const embed = new EmbedBuilder()
        .setTitle("Beggar")
        .setColor(Colors.Red)
        .setDescription(`**${negativeChoice}**\n`);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
