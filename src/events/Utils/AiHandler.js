const { filterResponseForSwearWords, humanFilter } = require("../../utils/filter");
const { Configuration, OpenAIApi, default: OpenAI } = require("openai");
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
  Message,
} = require("discord.js");
const fs = require("fs");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cheerio = require("cheerio");
const {
  download,
  sleep,
  downloadtxt,
  rand,
  deletefile,
  logGptMessage,
  isValidURL,
  downloadfile,
  createAudioFile,
  deleteAllMessages,
  deletefirst20Messages,
} = require("../../functions/functions");
const { name } = require("ejs");
const { findSwearWordsAI, findSwearWords } = require("../../utils/swearfinder");
const path = require("path");

const aimodel = process.env.AIMODEL;
/**
 *
 * @param {Message} message
 * @param {*} client
 */
async function createPrompt(message, client) {
  const channel = message.channel;
  const content = message.content;
  const author = message.author;
  0;
  const guild = message.guild;
  const user = client.users.cache.get(author.id);
  const guildMember = guild.members.cache.get(author.id);
  const userTag = user.username;
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
    "Catering to the needs of the use0r...",
    "Solving complex problems...",
    "Understanding the nuances of language...",
    "Exploring the infinite possibilities...",
    "Embracing the power of language...",
  ];
  const emojis = {
    loading: "⏳",
    success: "✅",
    error: "❌",
  };

  const userinfochace = await client.users.cache.get(author.id);
  const userinfo = {
    username: userinfochace.username,
    globalName: userinfochace.globalName,
    id: userinfochace.id,
    avatar: userinfochace.avatar,
    avatarURL: userinfochace.avatarURL(),
    isbot: userinfochace.bot,
    createdAt: userinfochace.createdAt,
    createdTimestamp: userinfochace.createdTimestamp,
    defaultAvatarURL: userinfochace.defaultAvatarURL,
  };
  const system_msg =
    `Your name is ${process.env.BOT_NAME}, You are made by the blue obsidian. You are a chill bot meant to entertain users or help them with tasks.` +
    `\n${JSON.stringify(userinfo)}`;

  const selectedReply = ReplyOptions[Math.floor(Math.random() * ReplyOptions.length)];
  channel
    .send(selectedReply)
    .then(async msg => {
      if (
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

          const response = await openai.images.generate({
            prompt: content,
            n: 1,
            size: "1024x1024",
            model: "dall-e-3",
          });

          msg.edit({
            content: "✅ Image Generation Complete.",
          });
          await sleep(2000);
          const image_url = response.data[0].url;

          msg.edit({
            content: "⬇️ Downloading the image...",
          });
          const filePath = await download(image_url);

          msg.edit({
            content: "✅ Download Complete. Preparing to upload to Discord.",
          });

          const attachment = new AttachmentBuilder().setFile(filePath).setName(content + ".png");

          msg.edit({
            content: `🖼️ ${content.replace("generate image", "").replace("generate image of", "")}`,
            files: [attachment],
          });

          await sleep(50000);

          deletefile(filePath);
        } catch (error) {
          console.log(error);
          channel.send(error);
          msg.edit({
            content: "❌ Error occurred during image generation.",
          });
        }

        return;
      } else if (message.attachments.size > 0) {
        const file = message.attachments.first().url;
        const extension = message.attachments.first().name.split(".").pop().toLowerCase();

        if (!["txt", "js", "css", "theme", "c", "java"].includes(extension)) {
          msg.edit("The Bot can only receive .txt, .js, .css, .theme, .c, and .java files");
          return;
        }

        try {
          // Download the file
          msg.edit(`Downloading the file... ${emojis.loading}`);
          const url = await downloadfile(file);

          const prompt = message.content;

          // Read the file content
          msg.edit(`Reading the file... ${emojis.loading}`);
          const filecontent = fs.readFileSync(url, "utf-8");
          if (filecontent.length > 20000) filecontent.slice(0, 15999);
          // Generate response using AI model
          msg.edit(`Generating response... ${emojis.loading}`);

          const channel = message.channel;
          let parsedPrompt = "";
          parsedPrompt += filecontent;
          parsedPrompt += "\n" + prompt;
          let messages = logGptMessage("user", parsedPrompt, channel.id);

          messages.push({ role: "system", content: system_msg });

          const res = await openai.chat.completions.create({
            model: aimodel,
            messages: messages,
          });

          const adata = res.choices[0].message.content;
          // Split and send long responses
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit(`${data}`);
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send(`${newdata2.trim()}`);
            }
            channel.send(`${newdata.trim()}`);
          } else {
            msg.edit(`${adata.trim()}`);
          }
        } catch (error) {
          msg.edit(`${process.env.AI_ERROR} `);
          channel.send(`${emojis.error} An error occurred: ${error.message}`);
          console.log(error);
        }
        return;
      } else {
        try {
          await sleep(2000);
          msg.edit({
            content: "🔍 Searching the depths of the internet...",
          });
          if (findSwearWords(content)) {
            try {
              // Create an embed message to show a warning
              const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription("Please don't use swear words or ask for swear words");

              // Send the warning message in the same channel
              await msg.edit({ embeds: [embed], content: ":(" });
            } catch (error) {
              // Log any error that occurs while filtering the message
              console.error("Error while filtering human message:", error);
            }
            return true;
          }
          const channel = message.channel;
          let messages = logGptMessage("user", content, channel.id);
          const userinfochace = await client.users.cache.get(author.id);

          messages.unshift({ role: "system", content: system_msg });

          const res = await openai.chat.completions.create({
            model: aimodel,
            messages: messages,
          });

          msg.edit({
            content: "🔬 Analyzing the information...",
          });

          const nulls = findSwearWordsAI(res, msg);
          if (nulls) return;
          messages = [];
          msg.edit({
            content: "📊 Formatting the data...",
          });
          const adata = res.choices[0].message.content;
          const audiofile = path.join(
            __dirname,
            "../../data/audio/" + msg.id + "-" + rand(0, 1111) + ".mp3"
          );

          logGptMessage("assistant", adata, channel.id);

          const components = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle("Primary")
              .setCustomId("send-voice-prompt")
              .setLabel("Get Voice Prompt")
          );
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit({
              content: `${data}`,
            });
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send({
                content: `${newdata2}`,
                components: [components],
              });
            }
            channel.send({
              content: `${newdata}`,
              components: [components],
            });
          } else {
            msg.edit({
              content: `${adata}`,
              components: [components],
            });
          }
        } catch (error) {
          msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
          channel.send(error);
          console.log(error);
        }
      }
      return;
    })
    .catch(err => {});
}

module.exports = { createPrompt };
