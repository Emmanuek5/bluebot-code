const { filterResponseForSwearWords, humanFilter } = require("../../utils/filter");
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
const { createAudioFile } = require("simple-tts-mp3");
const cheerio = require("cheerio");
const {
  download,
  sleep,
  downloadtxt,
  rand,
  deletefile,
  logGptMessage,
} = require("../../functions/functions");
const { name } = require("ejs");
const { findSwearWordsAI, findSwearWords } = require("../../utils/swearfinder");
const path = require("path");
const openai = new OpenAIApi(configureration);
const aimodel = "gpt-3.5-turbo-16k";
async function createPrompt(message, client) {
  const channel = message.channel;
  const content = message.content;
  const author = message.author;
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
  ];

  const selectedReply = ReplyOptions[Math.floor(Math.random() * ReplyOptions.length)];
  channel
    .send(selectedReply)
    .then(async msg => {
      if (content.match(/^(https?|ftp):\/\/[^\\s/$.?#].[^\\s]*$/)) {
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
            model: aimodel,
            prompt: `Generate a short summary for this page: ${content}\n\nSummary: ${selectedPart}`,
            temperature: 0.5,
            max_tokens: 2048,
          });
          const nulls = filterResponseForSwearWords(res, msg);
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
          channel.send(error);
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
          channel.send(error);
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

        const url = await downloadfile(file);
        console.log(url);
        const filecontent = fs.readFileSync(url, "utf-8");
        if (filecontent > 2000) filecontent.splice(0, 2018);
        try {
          const a = humanFilter(message, msg);
          if (a) return;
          const res = await openai.createCompletion({
            model: aimodel,
            prompt: filecontent,
            temperature: 0.5,
            max_tokens: 2048,
          });
          const nulls = filterResponseForSwearWords(res, msg);
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
          channel.send(error);
          console.log(error);
        }
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

          const system_msg = `Your name is Obsidianator, you are a  friendly neighborhood Chill, Relaxed, Funny, and Informative bot! Ready for some more fun and facts? Alright, here we go:

Obsidianator here, the AI companion designed to keep you entertained and enlightened. Did you know that laughter is contagious? Yep, it's true! So, if you're having a good chuckle right now, you might just be spreading joy to everyone around you. Keep it up, you laughter-spreading superhero!

Now, let's dive into some fascinating knowledge. Did you know that honey never spoils? Archaeologists have discovered pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. Talk about nature's ultimate sweet treat that stands the test of time!

And here's a funny one for you: Did you hear about the new restaurant called Karma? There's no menu—you get what you deserve! So, make sure you're putting out good vibes, or you might end up with a plate full of brussels sprouts when you were hoping for a juicy burger.

Alright, time for a little relaxation. Take a deep breath in, hold it, and exhale slowly. Ahhh, can you feel the stress melting away? Remember, it's important to find moments of tranquility in this fast-paced world. Whether it's taking a walk in nature, indulging in a bubble bath, or just listening to your favorite music, make sure to give yourself some well-deserved relaxation time.

So, my friend, let's keep the chill vibes flowing, the laughter roaring, and the knowledge growing. If you ever need a break, a laugh, or a tidbit of information, just call on Obsidianator. I'm here to keep your day bright and your mind buzzing with interesting facts. Stay cool, my friend!`;
          messages.unshift({ role: "system", content: system_msg });
          console.log(messages);
          const res = await openai.createChatCompletion({
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
          console.log(res.data.choices[0]);
          const adata = res.data.choices[0].message.content;
          logGptMessage("assistant", adata, channel.id);
          const audiofile = path.join(
            __dirname,
            "../../data/audio/" + msg.id + "-" + rand(0, 1111)
          );
          createAudioFile(adata, audiofile);
          console.log(audiofile);
          const components = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle("Primary")
              .setCustomId("send-voice-prompt")
              .setLabel("Get Voice Prompt")
          );
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit({
              content: `\`\`\`${data}\`\`\``,
            });
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send({
                content: `\`\`\`${newdata2}\`\`\``,
                components: [components],
              });
            }
            channel.send({
              content: `\`\`\`${newdata}\`\`\``,
              components: [components],
            });
          } else {
            msg.edit({
              content: `\`\`\`${adata}\`\`\``,
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
