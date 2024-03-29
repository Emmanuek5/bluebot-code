const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, Colors } = require("discord.js");
const { Configuration, OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  usage: "Ask Chat Gpt A Question",
  data: new SlashCommandBuilder()
    .setName("ask-gpt")
    .setDescription("Ask Chat-Gpt A Question")
    .addStringOption(option =>
      option.setName("question").setRequired(true).setDescription("The Question To Ask")
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const question = interaction.options.getString("question");

    try {
      const res = await openai.completions.create({
        model: "text-davinci-003",
        prompt: question,
        temperature: 0.5,
        max_tokens: 2048,
      });

      const emeb = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setDescription(`\`\`\`${res.choices[0].text}\`\`\``);
      await interaction.editReply({ embeds: [emeb] });
    } catch (error) {
      console.log(error);
      await interaction.editReply({ content: `Request Faild With Code *${error}*` });
    }
  },
};
