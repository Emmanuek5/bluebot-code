const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { rand } = require("../../functions/functions");

module.exports = {
  usage: "Returns a random meme",
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Returns a random meme")
    .addStringOption(option =>
      option
        .setName("platform")
        .setDescription("The platform to get the meme from (optional))")
        .addChoices({ name: "Reddit", value: "reddit" }, { name: "giphy", value: "giphy" })
        .setRequired(false)
    ),
  async execute(interaction, client, argvs) {
    const { guild, member, options } = interaction;
    const platform = options.getString("platform");

    async function redditMeme() {
      const response = await fetch("https://www.reddit.com/r/memes/random/.json");
      const meme = await response.json();

      const embed = new EmbedBuilder()
        .setTitle(meme[0].data.children[0].data.title)
        .setURL(`https://reddit.com${meme[0].data.children[0].data.permalink}`)
        .setImage(meme[0].data.children[0].data.url)
        .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
        .setFooter({
          text: `👍 ${meme[0].data.children[0].data.ups} | 💬 ${meme[0].data.children[0].data.num_comments}`,
        })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    async function giphyMeme() {
      const response = await fetch(
        "https://api.giphy.com/v1/gifs/random?api_key=yCCeJ38QdVX56QpnxgH8fZScUVR0m7S5&tag=meme&rating=g"
      );
      const meme = await response.json();

      const embed = new EmbedBuilder()
        .setTitle(meme.data.title)
        .setURL(meme.data.url)
        .setImage(meme.data.images.original.url)
        .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
        .setFooter({ text: `👍 ${meme.data.import_datetime} | 💬 ${meme.data.username}` })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    if (platform === "reddit") {
      redditMeme();
    } else if (platform === "giphy") {
      giphyMeme();
    } else {
      const random = rand(1, 100);
      console.log(random);
      if (random <= 50) {
        redditMeme();
      } else {
        giphyMeme();
      }
    }
  },
};
