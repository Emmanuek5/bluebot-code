const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const ecoSChema = require("../../models/economy.js");
const { Colors } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("transfer").setDescription("Transfer to your back")
    .addNumberOption((option) => option.setName("amount").setDescription("Amount to transfer").setRequired(true)),
  async execute(interaction) {
    const { user, guild } = interaction;

    let Data = await ecoSChema.findOne({ Guild: guild.id, User: user.id });
    console.log(Data);
   if (!Data) return interaction.reply({ content: "You don't have an Economy Account", ephemeral: true })

    const amount = interaction.options.getNumber("amount");
    if (amount < 1) return interaction.reply({ content: "You can't transfer less than $1", ephemeral: true });
    if (Data.Wallet < amount) return interaction.reply({ content: "You don't have enough money", ephemeral: true });

    Data.Wallet -= amount;
    Data.Bank += amount;
    Data.save();

    const embed = new EmbedBuilder()
      .setTitle("Transfer")
      .setColor(Colors.Blue)
      .setDescription(`You transfered **${amount}** to your bank`)
      .setTimestamp(); 

await  interaction.reply({ embeds: [embed] });






  
  }
   
  ,
};
