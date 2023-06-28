const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
  ButtonInteraction,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");

const ticketSchema = require("../../models/tickets");

module.exports = {
  usage: "Usage: /ticket - Create a ticket for support, add users to a ticket, or close a ticket",
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create a ticket")
    .addSubcommand(subcommand =>
      subcommand
        .setName("create")
        .setDescription("Create a ticket")
        .addStringOption(option =>
          option.setName("reason").setDescription("Reason for ticket").setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand.setName("close").setDescription("Close a ticket"))
    .addSubcommand(subcommand =>
      subcommand
        .setName("add")
        .setDescription("Add a user to a ticket")
        .addUserOption(option =>
          option.setName("user").setDescription("User to add").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("remove")
        .setDescription("Remove a user from a ticket")
        .addUserOption(option =>
          option.setName("user").setDescription("User to remove").setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let ticketParentid;
    if (subcommand === "create") {
      const { guild } = interaction;
      //find the ticket category if not create i t
      if (
        !guild.channels.cache.find(
          channel => channel.name === "tickets" && channel.type == ChannelType.GuildCategory
        )
      ) {
        const category = await guild.channels.create({
          name: "tickets",
          type: ChannelType.GuildCategory,
        });
        ticketParentid = category.id;
      } else {
        const category = guild.channels.cache.find(
          channel => channel.name === "tickets" && channel.type == ChannelType.GuildCategory
        );

        ticketParentid = category.id;
      }
      const reason = interaction.options.getString("reason");
      const ticket = await ticketSchema.findOne({
        guildID: interaction.guild.id,
        userID: interaction.user.id,
      });
      if (ticket) {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("You already have a ticket open")
          .setColor("Red")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        return interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("Your ticket has been created")
          .setColor("Green")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        interaction.reply({ embeds: [embed] });
        const ticketEmbed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("Reason: " + reason)
          .setColor("Green")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("close").setLabel("Close").setStyle("Danger")
        );
        //find category with name 'tickets' and use that id
        const channel = await interaction.guild.channels.create({
          name: "ticket-" + interaction.user.username,
          type: ChannelType.GuildText,
          parent: ticketParentid,
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
        channel.send({ embeds: [ticketEmbed], components: [row] });
        const newTicket = new ticketSchema({
          guildID: interaction.guild.id,
          userID: interaction.user.id,
          channelID: channel.id,
          ticket: reason,
        });
        newTicket.save();
      }
    } else if (subcommand == "close") {
      const ticket = await ticketSchema.findOne({
        guildID: interaction.guild.id,
        userID: interaction.user.id,
      });
      if (!ticket) {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("You do not have a ticket open")
          .setColor("Red")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        return interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("Your ticket has been closed")
          .setColor("Green")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        const channel = await interaction.member.guild.channels.cache.find(
          c => c.id === ticket.channelID
        );
        channel.delete();
        await ticketSchema.findOneAndDelete({
          guildID: interaction.guild.id,
          userID: interaction.user.id,
        });
        interaction.reply({ embeds: [embed] });
      }
    } else if (subcommand === "add") {
      const user = interaction.options.getUser("user");
      const ticket = await ticketSchema.findOne({
        guildID: interaction.guild.id,
        userID: interaction.user.id,
      });
      if (!ticket) {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("You do not have a ticket open")
          .setColor("Red")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        return interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription(`${user.username} has been added to your ticket`)
          .setColor("Green")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        const channel = await interaction.member.guild.channels.cache.find(
          c => c.id === ticket.channelID
        );
        channel.permissionOverwrites.edit(user.id, {
          allow: [PermissionsBitField.Flags.ViewChannel],
        });

        interaction.reply({ embeds: [embed] });
      }
    } else if (subcommand === "remove") {
      const user = interaction.options.getUser("user");
      const ticket = await ticketSchema.findOne({
        guildID: interaction.guild.id,
        userID: interaction.user.id,
      });
      if (!ticket) {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("You do not have a ticket open")
          .setColor("Red")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        return interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription(`${user.username} has been removed from your ticket`)
          .setColor("Green")
          .setTimestamp()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        interaction.reply({ embeds: [embed] });

        const channel = await interaction.member.guild.channels.cache.find(
          c => c.id === ticket.channelID
        );
        channel.permissionOverwrites.edit(user.id, {
          deny: [PermissionsBitField.Flags.ViewChannel],
        });
      }
    }
  },
};
