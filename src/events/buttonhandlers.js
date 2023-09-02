const ytdl = require("ytdl-core");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const ticketSchema = require("../models/tickets");
const { getBadWords } = require("../commands/moderation/roles/badwords");
const path = require("path");
const fs = require("fs");
/**
 * Handles button interactions.
 *
 * @param {Interaction} interaction - The interaction object representing the button click event.
 * @param {Client} client - The client object representing the Discord bot.
 * @return {Promise<void>} - A promise that resolves when the function is finished executing.
 */
async function buttons(interaction, client) {
  if (interaction.isButton()) {
    if (interaction.customId === "send-voice-prompt") {
      const message_id = interaction.message.id;
      const audioFolder = path.join(__dirname, "../data/audio/");

      // Read the contents of the audio folder
      fs.readdir(audioFolder, (err, files) => {
        if (err) {
          console.error("Error reading audio folder:", err);
          return;
        }
        const matchingFile = files.find(file => file.startsWith(message_id));
        if (matchingFile) {
          const filePath = path.join(audioFolder, matchingFile);
          const attachment = new AttachmentBuilder().setName(matchingFile).setFile(filePath);
          interaction.reply({ content: "Here is your voice prompt", files: [attachment] });
          console.log("Matching file found:", filePath);
        } else {
          interaction.reply({ content: "Your File is still being created, please wait." , ephemeral: true});
          console.log("No matching file found for message ID:", message_id);
        }
      });
    }
    if (interaction.customId == "close") {
      const ticket = await ticketSchema.findOne({
        guildID: interaction.guild.id,
        userID: interaction.user.id,
      });
      if (ticket) {
        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .setDescription("Your ticket has been closed")
          .setColor("Red")
          .setTimestamp()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL(),
          })
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          });
        interaction.reply({ embeds: [embed] });
        await ticketSchema.findOneAndDelete({
          guildID: interaction.guild.id,
          userID: interaction.user.id,
        });
      } else {
        interaction.reply({ content: "Your Not The Owner of this ticket" });
      }
      const channel = await interaction.guild.channels.cache.find(c => c.id === ticket.channelID);
      channel.delete();
    }
    if (interaction.customId == "delete-invite") {
      interaction.message.delete();
    }
    if (interaction.customId == "song-forward") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      player.seek(player.position + 10000);
      interaction.reply({
        content: "Forwarded 10 seconds",
        ephemeral: true,
      });
    }
    if (interaction.customId == "song-back") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      player.seek(player.position - 10000);
      interaction.reply({ content: "Backed 10 seconds", ephemeral: true });
    }
    if (interaction.customId == "song-pause") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      player.pause(true);
      interaction.reply({ content: "Paused", ephemeral: true });
    }
    if (interaction.customId == "song-play") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      player.pause(false);
      interaction.reply({ content: "Resumed", ephemeral: true });
    }
    if (interaction.customId == "song-stop") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      player.destroy();
      interaction.reply({ content: "Stopped", ephemeral: true });
    }
    if (interaction.customId == "song-skip") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      player.stop();
      interaction.reply({ content: "Skipped", ephemeral: true });
    }
    if (interaction.customId == "song-queue") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) interaction.reply({ content: "No song playing", ephemeral: true });
      const queue = player.queue
        .map((track, i) => {
          return `${i === 0 ? "Now Playing" : `#${i + 1}`} - ${track.title}`;
        })
        .join("\n");
      const embed = new EmbedBuilder()
        .setTitle("Queue")
        .setDescription(queue)
        .setColor("Random")
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
        })
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (interaction.customId == "song-volume") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) return;
      const currentVolume = player.volume;
      const newVolume = currentVolume + 10;
      player.setVolume(newVolume);
      interaction.reply({
        content: `Volume set to ${newVolume}`,
        ephemeral: true,
      });
    }
    if (interaction.customId == "queue-next") {
      const { member, guild } = interaction;
      const player = client.manager.players.get(guild.id);
      if (!player) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("There is nothing playing")
              .setColor("Red")
              .setAuthor({
                name: "Obsidianator",
                iconURL: process.env.BOT_AVATAR,
              })
              .setTimestamp(),
          ],
        });
      }
      const queue = player.queue;

      const songList = queue.slice(25, 40);
      const embed = new EmbedBuilder()
        .setTitle("Queue")

        .setColor("Purple")
        .setAuthor({ name: "Obsidianator", iconURL: process.env.BOT_AVATAR })
        .setTimestamp();
      songList.forEach((song, index) => {
        embed.addFields({
          name: `${index + 1}. ${song.title}`,
          value: `${song.author} | ${new Date(song.duration).toISOString().slice(11, 19)}`,
        });
      });
      return interaction.reply({
        embeds: [embed],
      });
    }
    if (interaction.customId == "song-volume-down") {
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) return;
      const currentVolume = player.volume;
      const newVolume = currentVolume - 10;
      player.setVolume(newVolume);
    }

    if (interaction.customId == "badwords-next") {
      const badWords = await getBadWords(interaction.guild);
      const nextBadWords = badWords.slice(100, 200);

      const embed = new EmbedBuilder()
        .setTitle("Bad Words")
        .setDescription(nextBadWords.join("\n"))
        .setColor("Random")
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
        })
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      interaction.editReply({
        embeds: [embed],
      });
    }
  }
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == "roles") {
      for (let i = 0; i < interaction.values.length; i++) {
        const role = interaction.guild.roles.cache.find(r => r.id === interaction.values[i]);
        const hasRole = interaction.member.roles.cache.has(role.id);
        switch (hasRole) {
          case true:
            interaction.member.roles.remove(role);
            break;
          case false:
            interaction.member.roles.add(role);
            break;
        }
      }
      interaction.reply({ content: "Roles updated", ephemeral: true });
    }
  }
}

module.exports = { buttons };
