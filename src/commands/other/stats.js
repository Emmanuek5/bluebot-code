const os = require("os");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bytes = require("bytes");
module.exports = {
  data: new SlashCommandBuilder().setName("bot-stats").setDescription("Retrives The Bots Stats"),
  async execute(interaction, client) {
    const { guild, member } = interaction;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = os.totalmem() - os.freemem();
    const usedPercent = Math.round((usedMem / totalMem) * 100);
    const memoryUsage = `${bytes(usedMem)} / ${bytes(totalMem)}`;
    const serverList = process.env.SERVER_COUNT;

    const embed = new EmbedBuilder()
      .setTitle("Stats")
      .setDescription("The Bots Stats")
      .setFields(
        { name: "Ram", value: memoryUsage + " ||" + usedPercent.toLocaleString() + "%" || "0" },
        { name: "Servers", value: serverList.toString() || "0" },
        { name: "Owner", value: "The Obsidian Group" },
        { name: "Support", value: "https://discord.gg/UgyJCKXq" }
      )
      .setThumbnail(process.env.BOT_AVATAR);
      interaction.reply({ embeds: [embed] });
  },
};
