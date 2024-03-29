const {
  Client,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const { Economy } = require("../../economy/base");
const ecoSChema = require("../../models/economy");

module.exports = {
  data: new SlashCommandBuilder().setName("economy").setDescription("Create Your Economy Account"),
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const eco = new Economy();
    let Data = await eco.findUser(user.id);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Account")
      .setDescription("Choose your option")
      .addFields(
        { name: "Create", value: "Create your account" },
        { name: "Delete", value: "Delete your account" }
      );

    const embed2 = new EmbedBuilder()
      .setColor("Green")

      .setDescription("Your account has been created")
      .addFields({
        name: "Success",
        value: "Your account has been created and you have reiceived $1000",
      })
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    const embed3 = new EmbedBuilder()
      .setColor("Green")

      .setDescription("Your account has been deleted")
      .addFields({ name: "Success", value: "Your account has been deleted" })
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page1")
        .setLabel("Create")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("page2")
        .setLabel("Delete")
        .setEmoji("⛔")
        .setStyle(ButtonStyle.Danger)
    );

    const message = await interaction.reply({ embeds: [embed], components: [button] });

    const collector = await message.createMessageComponentCollector();

    collector.on("collect", async i => {
      if (i.user.id !== interaction.user.id)
        interaction.reply({
          content: `Only ${interaction.user.username} can use this button`,
          ephemeral: true,
        });

      if (i.customId === "page1") {
        if (Data)
          return i.update({
            content: `You already have an account`,
            ephemeral: true,
            embeds: [],
            components: [],
          });
        Data = new ecoSChema({
          Guild: interaction.guild.id,
          User: interaction.user.id,
          Wallet: 1000,
          Bank: 0,
        });

        await Data.save();

        await i.update({ embeds: [embed2], components: [] });
      }

      if (i.customId === "page2") {
        await Data.deleteOne();

        await i.update({ embeds: [embed3], components: [] });
      }
    });
  },
};
