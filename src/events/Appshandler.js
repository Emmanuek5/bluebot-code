const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("@discordjs/builders");
const { TextInputStyle, PermissionsBitField, EmbedBuilder, Colors } = require("discord.js");

const reportSchema = require("../models/reports");
const fs = require("fs");
const path = require("path");
const ServerSchema = require("../models/server");
async function appHandler(interaction, client) {
  const { id } = interaction.targetMember;
  const { guild, user } = interaction;
  const { commandName } = interaction;
  const serverdata = ServerSchema.findOne({ guildId: guild.id });
  if (commandName == "Report") {
    if (id == user.id) {
      const embed = new EmbedBuilder().setDescription("You can't report yourself...");
      interaction.reply({ embeds: [embed] });
      return;
    }
    const modal = new ModalBuilder()
      .setTitle("Report a user")
      .setCustomId("reportUserModal")
      .addComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId("reportMessage")
            .setLabel("report Message")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(500)
            .setMinLength(10)
            .setRequired(true)
        )
      );
    await interaction.showModal(modal);
    const modalSubmit = await interaction.awaitModalSubmit({
      filter: i => {
        return true;
      },
      time: 100000,
    });
    const Reason = modalSubmit.fields.getTextInputValue("reportMessage");
    let reports = await reportSchema.findOne({ userId: id, guildId: guild.id });
    const member = client.guilds.cache.get(guild.id).members.cache.get(id);
    if (!reports) {
      const newReport = new reportSchema({
        userId: id,
        reasons: {
          user: interaction.member.id,
          reason: Reason,
        },
        guildId: guild.id,
        reportCount: 1,
      });
      await newReport.save();
      reports = newReport;
    }
    if (reports.reportCount > 9) {
      if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        interaction.reply({
          content: "This User Has Been Reported 10 Times But I Cannot Mute Them :sob:",
        });
        return;
      }
    }
    const options = {
      user: interaction.member.id,
      reason: Reason,
    };
    reports.reportCount += 1;
    reports.reasons.push(options);
    await reports.save();
    member.timeout(50000 * 15, "You Have Been Reported 10 Times");
    modalSubmit.reply({
      content: `Thank You For Reporting ${
        interaction.targetMember
      }. Reason: ${modalSubmit.fields.getTextInputValue("reportMessage")}`,
      ephemeral: true,
    });
  }
  if (commandName == "Rank") {
    const { options, user, guildId } = interaction;
    const { id, username } = interaction.targetMember;
    const Levels = require("discord.js-leveling");
    const userlevel = await Levels.fetch(id, guildId);
    if (!userlevel) {
      interaction.reply({
        content: "Seems like this user has not earned any xp so far.",
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Rank")
        .setDescription(
          `**${interaction.targetMember}** is level ${userlevel.level} and has ${userlevel.xp} xp!`
        )
        .setColor("Random")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR });
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  }
  if (commandName == "Show Avatar") {
    await interaction.deferReply();
    const { id, displayName, guild } = interaction.targetMember;
    const member = client.guilds.cache.get(guild.id).members.cache.get(id);
    const url = member.user.avatarURL() + "?size=1024";
    const embed = new EmbedBuilder()
      .setTitle(`${member.user.username}'s Avatar`)
      .setDescription(`[Avatar Url](${member.user.avatarURL()})`)
      .setImage(url);
    await interaction.editReply({ embeds: [embed] });
  }
  if (commandName == "Ban") {
    const { guild, targetMember, member } = interaction;
    const { id } = targetMember;
    if (id == user.id) {
      const embed = new EmbedBuilder().setDescription("You can't ban yourself...");
      interaction.reply({ embeds: [embed] });
      return;
    }
    if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
      interaction.reply({ content: "I Dont Have Permmisions For That" });
    }
    const modal = new ModalBuilder()
      .setTitle("Ban Message")
      .setCustomId("banUserModal")
      .addComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId("banMessage")
            .setLabel("ban Message")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(500)
            .setMinLength(10)
            .setRequired(true)
        )
      );
    await interaction.showModal(modal);
    const modalSubmit = await interaction.awaitModalSubmit({
      filter: i => {
        return true;
      },
      time: 100000,
    });
    const reason = modalSubmit.fields.getTextInputValue("banMessage");
    targetMember
      .ban({
        deleteMessageSeconds: 60 * 60 * 24 * 7,
        reason: reason,
      })
      .then(console.log)
      .catch(console.error);
    modalSubmit.reply({ content: `Baned ${targetMember}. For: ${reason}` });
  }
  if (commandName == "Balance") {
    const { Economy } = require("../economy/base");
    const { user, targetMember, guild } = interaction;
    const eco = new Economy();
    let Data = await eco.findUser(targetMember.id);

    if (!Data) {
      return interaction.reply({
        content: "The user dont have an economy profile yet",
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
  }
}
module.exports = {
  appHandler,
};
