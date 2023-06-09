const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const ecoSChema = require("../../models/economy.js");
const { Colors } = require("discord.js");
const { Economy } = require("../../economy/base");

module.exports = {
  data: new SlashCommandBuilder().setName("balance").setDescription("Check Your Balance"),
  async execute(interaction) {
    const { user, guild } = interaction;
    const eco = new Economy();
    let Data = await eco.findUser(user.id);
    console.log(Data);

    if (!Data) {
      return interaction.reply({
        content: "You dont have an economy profile yet",
        ephemeral: true,
      });
    }
    const wallet = Math.floor(Data.Wallet);
    const bank = Math.floor(Data.Bank);
    const total = wallet + bank;
    const embed = new EmbedBuilder()
      .setTitle("Economy")
      .setColor(Colors.Blue)
      .setDescription(`**Wallet**: $${wallet}\n**Bank**: $${bank}\n**Total**: $${total}  `)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.reply({ embeds: [embed] });
  },
};
