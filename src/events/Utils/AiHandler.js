const { aiFilter, humanFilter } = require("../../utils/filter");
const { Configuration, OpenAIApi } = require("openai");
const {
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  MessageType,
  MessageActivityType,
  userMention,
  PermissionFlagsBits,
  ChannelType,
  PermissionsBitField,
  RoleManager,
  Colors,
  AttachmentBuilder,
} = require("discord.js");
const fs = require("fs");
const configureration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const cheerio = require("cheerio");
const { download, sleep, downloadtxt, rand, deletefile } = require("../../functions/functions");
const { name } = require("ejs");
const openai = new OpenAIApi(configureration);

async function createPrompt(message, client) {
  const channel = message.channel;
  const content = message.content;
  const author = message.author;
  const guild = message.guild;
  const user = client.users.cache.get(author.id);
  const guildMember = guild.members.cache.get(author.id);
  const userTag = user.tag;
  const guildName = guild.name;
  const guildMemberCount = guild.memberCount;
  const guildMemberNickname = guildMember.nickname;
  const guildMemberNicknameTag = guildMemberNickname
    ? `<@${guildMemberNickname}>`
    : `<@${author.id}>`;
  const guildMemberNicknameTag2 = guildMemberNickname
    ? `<@!${guildMemberNickname}>`
    : `<@!${author.id}>`;
  const guildMemberNicknameTag3 = guildMemberNickname
    ? `<@${guildMemberNickname}>`
    : `<@${author.id}>`;
  const guildMemberNicknameTag4 = guildMemberNickname;

  const ReplyOptions = [
    "Generating AI Prompts...",
    "The Bot is thinking...",
    "We are getting the answers to your question...",
    "Analyzing the data...",
    "Please wait while we process your request...",
    "Searching for the information...",
    "Compiling the response...",
    "Exploring the possibilities...",
    "Delving into the knowledge...",
    "In the realm of artificial intelligence...",
    "Unleashing the power of algorithms...",
    "Venturing into the realm of knowledge...",
    "Harnessing the computational prowess...",
    "Unlocking the secrets of language...",
    "Embarking on an intellectual journey...",
    "Connecting dots to form insights...",
    "Empowering the neural networks...",
    "Navigating through the vast information landscape...",
    "Transforming data into wisdom...",
    "Crafting responses with precision...",
  ];

  const selectedReply = ReplyOptions[Math.floor(Math.random() * ReplyOptions.length)];
  channel
    .send(selectedReply)
    .then(async msg => {
      if (content.match("^(https?|ftp)://[^s/$.?#].[^s]*$")) {
        try {
          const webPagedata = fetch(content).then(res => res.text());
          const webPage = await webPagedata;
          const $ = cheerio.load(webPage);
          const metaTags = [];
          $("meta").each((index, element) => {
            const name = $(element).attr("name");
            const content = $(element).attr("content");
            if (name && content) {
              metaTags.push({ name, content });
            }
          });
          const selectedPart = webPage ? webPage.slice(0, 1990) : webPage.slice(1999);
          console.log(metaTags);
          const a = humanFilter(message, msg);
          if (a) return;
          const res = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: selectedPart,
            temperature: 1.5,
            max_tokens: 2048,
          });
          const nulls = aiFilter(res, msg);
          if (nulls) return;
          const adata = res.data.choices[0].text;
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit(`\`\`\`${data}\`\`\``);
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send(`\`\`\`${newdata2}\`\`\``);
            }
            channel.send(`\`\`\`${newdata}\`\`\``);
          } else {
            msg.edit(`\`\`\`${adata}\`\`\``);
          }
        } catch (error) {
          msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
          channel.send(error.data);
          console.log(error);
        }
        return;
      } else if (
        content.toLowerCase().startsWith("generate image of") ||
        content.toLowerCase().startsWith("image of") ||
        content.toLowerCase().startsWith("generate an image of") ||
        content.toLowerCase().startsWith("generate image")
      ) {
        try {
          msg.edit({
            content: "🎨 Beginning Image Creation Process...",
          });
          await sleep(4000);
          msg.edit({
            content: "⌛ Generating the image...",
          });

          const response = await openai.createImage({
            prompt: content,
            n: 1,
            size: "1024x1024",
          });

          msg.edit({
            content: "✅ Image Generation Complete.",
          });
          await sleep(2000);
          const image_url = response.data.data[0].url;

          msg.edit({
            content: "⬇️ Downloading the image...",
          });
          const filePath = await download(image_url);
          console.log(filePath);

          msg.edit({
            content: "✅ Download Complete. Preparing to upload to Discord.",
          });

          const attachment = new AttachmentBuilder().setFile(filePath).setName(content + ".png");
          console.log(attachment);

          msg.edit({
            content: `🖼️ ${content.replace("generate image", "").replace("generate image of", "")}`,
            files: [attachment],
          });

          await sleep(50000);

          deletefile(filePath);
        } catch (error) {
          console.log(error);
          msg.edit({
            content: "❌ Error occurred during image generation.",
          });
        }

        return;
      } else if (message.attachments.size > 0) {
        const file = message.attachments.first().url;
        const extension = file.split(".").pop().toLowerCase();
        if (
          extension !== "txt" &&
          extension !== "js" &&
          extension !== "css" &&
          extension !== "theme" &&
          extension !== "c" &&
          extension !== "java"
        ) {
          msg.edit("The Bot can only receive .txt, .js, .css, .theme, .c, and .java files");
          return;
        }

        const url = await downloadtxt(file);
        const filecontent = fs.readFileSync(url, "utf-8");
        if (filecontent > 2000) filecontent.splice(0, 2018);
        try {
          const a = humanFilter(message, msg);
          if (a) return;
          const res = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: filecontent,
            temperature: 0.5,
            max_tokens: 2048,
          });
          const nulls = aiFilter(res, msg);
          if (nulls) return;

          const adata = res.data.choices[0].text;
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit(`\`\`\`${data}\`\`\``);
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send(`\`\`\`${newdata2}\`\`\``);
            }
            channel.send(`\`\`\`${newdata}\`\`\``);
          } else {
            msg.edit(`\`\`\`${adata}\`\`\``);
          }
        } catch (error) {
          msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
          channel.send(error.data);
          console.log(error);
        }
      } else {
        try {
          console.log("Nr");
          const a = humanFilter(message, msg);
          if (a) return;
          const res = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: content,
            temperature: 0.5,
            max_tokens: 2048,
          });
          const nulls = aiFilter(res, msg);
          if (nulls) return;

          const adata = res.data.choices[0].text;
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit(`\`\`\`${data}\`\`\``);
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send(`\`\`\`${newdata2}\`\`\``);
            }
            channel.send(`\`\`\`${newdata}\`\`\``);
          } else {
            msg.edit(`\`\`\`${adata}\`\`\``);
          }
        } catch (error) {
          msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
          channel.send(error.data);
          console.log(error);
        }
      }

      return;
    })
    .catch(err => {});
}

module.exports = { createPrompt };
