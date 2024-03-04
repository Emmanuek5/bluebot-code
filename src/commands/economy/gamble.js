const { SlashCommandBuilder, Colors } = require("discord.js");
const { Economy } = require("../../economy/base");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Gamble some money")
    .addNumberOption(option =>
      option.setName("amount").setDescription("Amount to gamble").setRequired(true)
    ),
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const amount = interaction.options.getNumber("amount");
    const eco = client.economy;
    let ecoUser = eco.findUser(user.id);
    if (!ecoUser) {
      return interaction.reply({
        content: "You dont have an economy profile yet",
        ephemeral: true,
      });
    }
    if (amount > ecoUser.Wallet + ecoUser.Bank) {
      return interaction.reply({
        content: "You dont have that much money",
        ephemeral: true,
      });
    }
    if (amount < 1) {
      return interaction.reply({
        content: "You cant bet less than 1",
        ephemeral: true,
      });
    }

    const emebed = new EmbedBuilder();
    await interaction.deferReply();

    interaction.editReply({ content: "Gambling..." });
    eco
      .gamble(user.id, amount)
      .then(async message => {
        console.log(message);
        if (!message.includes("won")) {
          emebed.setTitle("Gambling - Lost $" + amount);
          emebed.setDescription(message.toString());
          emebed.setColor(Colors.Red);

          await interaction.editReply({ embeds: [emebed] });
          return;
        }

        emebed.setTitle("Gambling - Won $" + amount * 2);
        emebed.setDescription(message.toString());
        emebed.setColor(Colors.Green);

        await interaction.editReply({ embeds: [emebed] });
      })
      .catch(err => {
        console.log(err);
        interaction.editReply({ content: "Something went wrong", ephemeral: true });
      });
  },
};
