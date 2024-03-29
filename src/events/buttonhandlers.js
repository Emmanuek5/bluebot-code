const ytdl = require("ytdl-core");
const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  Colors,
} = require("discord.js");
const ticketSchema = require("../models/tickets");
const { getBadWords } = require("../commands/moderation/roles/badwords");
const path = require("path");
const fs = require("fs");
const { createAudioFile } = require("../functions/functions");
const { Economy } = require("../economy/base");
/**
 * Handles button interactions.
 *
 * @param {ButtonInteraction} interaction - The interaction object representing the button click event.
 * @param {Client} client - The client object representing the Discord bot.
 * @return {Promise<void>} - A promise that resolves when the function is finished executing.
 */
async function buttons(interaction, client) {
  if (interaction.isButton()) {
    if (interaction.customId === "send-voice-prompt") {
      await interaction.deferReply({ ephemeral: true });
      const message_id = interaction.message.id;
      const message_content = interaction.message.content;
      const audioFolder = path.join(__dirname, "../data/audio/");

      await createAudioFile(message_content, audioFolder + message_id + ".mp3");

      if (!fs.existsSync(audioFolder)) {
        fs.mkdirSync(audioFolder, { recursive: true });
      }

      if (!fs.existsSync(path.join(audioFolder, message_id + ".mp3"))) {
        const File = await createAudioFile(message_content, audioFolder + message_id + ".mp3");
        const attachment = new AttachmentBuilder().setName(message_id + ".mp3").setFile(File);
        interaction.editReply({
          content: "Here is your voice prompt",
          files: [attachment],
          ephemeral: true,
        });
      } else {
        const attachment = new AttachmentBuilder()
          .setName(message_id + ".mp3")
          .setFile(path.join(audioFolder, message_id + ".mp3"));
        interaction.editReply({
          content: "Here is your voice prompt",
          files: [attachment],
          ephemeral: true,
        });
      }
    }

    if (interaction.customId === "controls") {
      const username = interaction.user.username;
      const embedcont = new EmbedBuilder();
      const rowcont = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("song-play").setLabel("Play").setStyle("Primary"),
        new ButtonBuilder().setCustomId("song-pause").setLabel("Pause").setStyle("Primary"),
        new ButtonBuilder().setCustomId("song-skip").setLabel("Skip").setStyle("Primary"),
        new ButtonBuilder().setCustomId("song-volume").setLabel("Volume Up").setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("song-volume-down")
          .setLabel("Volume Down")
          .setStyle("Primary")
      );
      embedcont
        .setTitle("Controls")
        .setDescription(`Controls for the music`)
        .setColor("Blurple")
        .setAuthor({ name: "The Blue Bot", iconURL: process.env.BOT_AVATAR })
        .setTimestamp()
        .setFooter({
          text: `Controls Command By: ${username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [embedcont], components: [rowcont] });
    }

    if (interaction.customId === "shop-next") {
      const shop = new Economy().getShop().slice(15);
      let fields = [];
      shop.forEach(item => {
        fields.push({ name: item.name, value: `Price: $${item.price}`, inline: true });
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Shop")
        .setDescription("Items in the shop")
        .addFields(fields)
        .setFooter({ text: "Page 2/2" });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("shop-previous").setLabel("<< Previous").setStyle("Primary")
      );
      interaction.update({ embeds: [embed], components: [row] });
    }

    if (interaction.customId === "shop-previous") {
      const shop = new Economy().getShop().slice(0, 15);
      let fields = [];
      shop.forEach(item => {
        fields.push({ name: item.name, value: `Price: $${item.price}`, inline: true });
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Shop")
        .setDescription("Items in the shop")
        .addFields(fields)
        .setFooter({ text: "Page 1/2" });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("shop-next").setLabel("Next >>").setStyle("Primary")
      );
      interaction.update({ embeds: [embed], components: [row] });
    }

    if (interaction.customId === "work-next") {
      const jobs = new Economy().WorkSystem.getJobs().slice(20);
      const embed = new EmbedBuilder()
        .setTitle("Work")
        .setColor(Colors.Blue)
        .setDescription("Available jobs")
        .addFields(
          jobs.map(job => {
            return { name: job.name, value: `Pay: $${job.salary}, Time: ${job.duration} seconds` };
          })
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("work-previous").setLabel("<< Previous").setStyle("Primary")
      );

      interaction.update({ embeds: [embed], components: [row] });
    }

    if (interaction.customId === "commands-next") {
      let commands = client.commands;
      let startIndex = 25;
      let endIndex = Math.min(commands.size, startIndex + 20); // Limit endIndex to the size of the commands collection

      let fields = [];
      let count = 0;

      // Iterate over the commands collection starting from the 25th command
      for (const [name, command] of commands) {
        if (count >= startIndex && count < endIndex) {
          fields.push({ name: command.data.name, value: command.data.description, inline: true });
        }
        count++;
      }

      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Help (Page 2)")
        .setDescription("List of commands")
        .addFields(fields);

      const components = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("commands-previous")
            .setLabel("<< Previous")
            .setStyle("Primary")
        ),
      ];

      await interaction.update({ embeds: [embed], components: components });
    }

    if (interaction.customId === "commands-previous") {
      let commands = client.commands;
      let startIndex = 0;
      let endIndex = 25;

      let fields = [];
      let count = 0;

      // Iterate over the commands collection starting from the 25th command
      for (const [name, command] of commands) {
        if (count >= startIndex && count < endIndex) {
          fields.push({ name: command.data.name, value: command.data.description, inline: true });
        }
        count++;
      }

      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Help (Page 1)")
        .setDescription("List of commands")
        .addFields(fields);

      const components = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("commands-next").setLabel("Next >>").setStyle("Primary")
        ),
      ];

      await interaction.update({ embeds: [embed], components: components });
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
