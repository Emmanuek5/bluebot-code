const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const ecoSChema = require("../../models/economy.js");
const { Colors } = require("discord.js");
const { dmhandler } = require("../../events/dmhandler.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Transfer to your bank or a user")
    .addSubcommand(subcommand =>
      subcommand
        .setName("user")
        .setDescription("Transfer to a user")
        .addUserOption(option =>
          option.setName("user").setDescription("User to transfer").setRequired(true)
        )
        .addNumberOption(option =>
          option.setName("amount").setDescription("Amount to transfer").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("bank")
        .setDescription("Transfer to your bank")
        .addNumberOption(option =>
          option.setName("amount").setDescription("Amount to transfer").setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const command = interaction.options.getSubcommand();

    let Data = await ecoSChema.findOne({ User: user.id });

    if (!Data)
      return interaction.reply({ content: "You don't have an Economy Account", ephemeral: true });

    if (command === "user") {
      const target = interaction.options.getUser("user");
      const amount = interaction.options.getNumber("amount");
      if (target == interaction.user)
        return interaction.reply({ content: "You can't transfer to yourself", ephemeral: true });

      if (amount > Data.Wallet)
        return interaction.reply({ content: "You don't have enough money", ephemeral: true });

      const targetData = await ecoSChema.findOne({ User: target.id });
      if (!targetData)
        return interaction.reply({
          content: "This user doesn't have an Economy Account",
          ephemeral: true,
        });

      Data.Wallet -= amount;
      targetData.Wallet += amount;

      await Data.save();
      await targetData.save();
      const user = client.users.cache.get(target.id);
      await user.send(`You have been transfered **$${amount}** from ${interaction.user}`);

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`You transfered **$${amount}** to ${target}`);

      interaction.reply({ embeds: [embed] });
    }

    if (command === "bank") {
      const amount = interaction.options.getNumber("amount");

      if (amount > Data.Wallet)
        return interaction.reply({ content: "You don't have enough money", ephemeral: true });

      Data.Wallet -= amount;
      Data.Bank += amount;

      await Data.save();

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`You transfered **$${amount}** to your bank`);

      interaction.reply({ embeds: [embed] });
    }
  },
};
