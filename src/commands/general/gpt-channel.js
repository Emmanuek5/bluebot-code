const { EmbedBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  Colors,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  usage: "Ask Chat Gpt A Question",
  data: new SlashCommandBuilder()
    .setName("gpt-channel")
    .setDescription("Creates A New Chat-Gpt Conversation"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const { user, guildId, guild, member } = interaction;
    const { username } = user;

    if (
      guild.channels.cache.find(
        c => c.name === "gpt-consersation-" + username.toLowerCase().replace(" ", "-")
      )
    ) {
      await interaction.editReply("You already have a Chat GPT Conversation open!");
      return;
    }
    var parentId = "";

    if (
      guild.channels.cache.find(
        c => c.name === "gpt-consersations" && c.type === ChannelType.GuildCategory
      )
    ) {
      parentId = guild.channels.cache.find(
        c => c.name === "gpt-consersations" && c.type === ChannelType.GuildCategory
      ).id;
    } else {
      const category = await guild.channels.create({
        name: "gpt-consersations",
        type: ChannelType.GuildCategory,
      });
      parentId = category.id;
    }

    const channel = await interaction.guild.channels.create({
      name: "gpt-consersation-" + username,
      parent: parentId,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    channel.send(`${member} You Have Started Your New Chat-GPT Conversation 
 To Close THis Conversation Type: close conversation 
 To Generate Iamges : Generate An Image Of
 `);
    const embed = new EmbedBuilder()
      .setTitle("You Have Opened A New Gpt Conversation")
      .setDescription("Your New Gpt Conversation Has Been Created")
      .setColor(Colors.Green)
      .setTimestamp()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    interaction.editReply({ embeds: [embed] });
  },
};
