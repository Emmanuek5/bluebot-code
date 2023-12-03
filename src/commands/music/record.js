const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Colors } = require("discord.js");
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require("@discordjs/voice");
const fs = require("fs");
const serverSchema = require("../../models/server");
module.exports = {
  usage: "Usage: /record - Records the current voice channel",
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription("Records the current voice channel"),
  async execute(interaction) {
    await interaction.deferReply();
    const { guild, member, options } = interaction;
    const user = {};
    const serverInfo = await serverSchema.findOne({
      guildID: guild.id,
    });
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      // User is not in a voice channel
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription("You Are Not In A Voice Channel");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    // Wait for the connection to be ready
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    } catch (error) {
      // Handle errors, perhaps clean up the connection
      console.error(error);
      connection.destroy();
      return;
    }
  },
};
