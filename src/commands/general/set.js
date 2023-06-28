const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const serverSchema = require("../../models/server");
require("dotenv").config();
const usage = "Usage: /set youtube <youtube channel> or /set color <color>";
module.exports = {
  usage,
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setName("set")
    .setDescription("Set a server setting")
    .addSubcommand(subcommand =>
      subcommand
        .setName("youtube")
        .setDescription("Set the youtube channel")
        .addStringOption(option =>
          option.setName("youtube").setDescription("The youtube channel").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("color")
        .setDescription("Set the server color")
        .addStringOption(option =>
          option.setName("color").setDescription("The server color").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("allow-swear-words")
        .setDescription("Allow Swear Wors on a server")
        .addBooleanOption(option =>
          option
            .setName("true-or-false")
            .setDescription("Sets it on or off")

            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("name")
        .setDescription("The Name of the bot")
        .addStringOption(option =>
          option.setName("name").setDescription("The Chosen Name").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("bully-me-channel")
        .setDescription("The Channel For THe Bully Me Bot")
        .addChannelOption(option =>
          option.setName("channel").setDescription("The Channel").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("welcome-channel")
        .setDescription("The Channel For The Welcome Messages")
        .addChannelOption(option =>
          option.setName("channel").setDescription("The Channel").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("leveling-channel")
        .setDescription("The Channel For The Level Up Messages")
        .addChannelOption(option =>
          option.setName("channel").setDescription("The Channel").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("goodbye-channel")
        .setDescription("The Channel For THe GoodBye Messages")
        .addChannelOption(option =>
          option.setName("channel").setDescription("The Channel").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("welcome-messages")
        .setDescription("Turn Welcome Messages on or off")
        .addBooleanOption(option =>
          option.setName("on-or-off").setDescription("Select The Desired Option").setRequired(true)
        )
    ),
  async execute(interaction, client, args) {
    const server = await serverSchema
      .findOne({ guildID: interaction.guild.id })
      .catch(err => console.log(err));
    const subcommand = interaction.options.getSubcommand();
    const option =
      interaction.options.getString("youtube") ||
      interaction.options.getString("color") ||
      interaction.options.getBoolean("true-or-false") ||
      interaction.options.getString("name") ||
      interaction.options.getChannel("channel") ||
      interaction.options.getBoolean("on-or-off");

    if (subcommand === "youtube") {
      await serverSchema
        .findOneAndUpdate({ guildID: interaction.guild.id }, { youtubeChannel: option })
        .catch(err => console.log(err));
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Youtube")
        .setDescription(`Youtube channel has been set to ${option}`)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
        })
        .setThumbnail(process.env.BOT_AVATAR)
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }
    if (!server.serverColor) server.serverColor = "Random";
    if (subcommand === "color") {
      const mess = option.toLowerCase();
      const color = option[0].toUpperCase();
      console.log(color);
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { serverColor: color }
      );
      const embed = new EmbedBuilder()
        .setColor(option)

        .setDescription(`Server color has been set to ${option}`);

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "allow-swear-words") {
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { swearWords: option }
      );
      const embed = new EmbedBuilder()
        .setDescription(`Allow Swear Words  has been set to ${option}`)
        .setColor(server.serverColor);

      return interaction.reply({ embeds: [embed] });
    }
    if (subcommand == "name") {
      const botid = process.env.CLIENT_ID;
      const name = option;
      const guild = await client.guilds.cache.get(interaction.guild.id);
      const user = await guild.members.cache.find(member => member.id === botid);
      await user.setNickname(name);
      const embed = new EmbedBuilder()
        .setDescription("Bot Name Has Been Set To " + name)
        .setColor(server.serverColor);

      interaction.reply({ embeds: [embed] });
    }

    if (subcommand == "bully-me-channel") {
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { bullyMeChannel: option }
      );
      const embed = new EmbedBuilder()
        .setDescription(`Bully Me Channel Set To ${option}`)
        .setColor(server.serverColor);

      interaction.reply({ embeds: [embed] });
    }

    if (subcommand == "welcome-channel") {
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { welcomeChannel: option }
      );
      const embed = new EmbedBuilder()
        .setDescription(`Welcome Channel Set To ${option}`)
        .setColor(server.serverColor);

      interaction.reply({ embeds: [embed] });
    }

    if (subcommand == "goodbye-channel") {
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { goodbyeChannel: option }
      );
      const embed = new EmbedBuilder()
        .setDescription(`Goodbye Channel Set To ${option}`)
        .setColor(server.serverColor);

      interaction.reply({ embeds: [embed] });
    }
    if (subcommand == "welcome-messages") {
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { welcomeMessage: option }
      );
      const embed = new EmbedBuilder().setDescription(
        `Sending of Welocme Messages Has Been Set To  ${option}`
      );

      interaction.reply({ embeds: [embed] });
    }
    if (subcommand == "leveling-channel") {
      await serverSchema.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { levelingChannel: option }
      );
      const embed = new EmbedBuilder()
        .setDescription(`Leveling Channel Set To ${option}`)
        .setColor(server.serverColor);

      interaction.reply({ embeds: [embed] });
    }
  },
};
