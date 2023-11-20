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
} = require("../../functions/functions");
const { name } = require("ejs");
const { findSwearWordsAI, findSwearWords } = require("../../utils/swearfinder");
const path = require("path");

const aimodel = "gpt-4-1106-preview";
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
  ];
  const emojis = {
    loading: "⏳",
    success: "✅",
    error: "❌",
  };
  const selectedReply = ReplyOptions[Math.floor(Math.random() * ReplyOptions.length)];
  channel
    .send(selectedReply)
    .then(async msg => {
      if (isValidURL(content)) {
        try {
          const webPagedata = fetch(content).then(res => res.text());
          const webPage = await webPagedata;
          const $ = cheerio.load(webPage);
          const metaTags = [];

          const selectedPart = webPage ? webPage.slice(0, 1990) : webPage.slice(1999);
          const res = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Generate a short summary for this page: ${content}\n\nSummary: ${selectedPart}`,
            temperature: 0.5,
            max_tokens: 2048,
          });

          const adata = res.choices[0].message.content;
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

          const response = await openai.images.generate({
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

        if (!["txt", "js", "css", "theme", "c", "java"].includes(extension)) {
          msg.edit("The Bot can only receive .txt, .js, .css, .theme, .c, and .java files");
          return;
        }

        try {
          // Download the file
          msg.edit(`Downloading the file... ${emojis.loading}`);
          const url = await downloadfile(file);
          console.log(url);

          // Read the file content
          msg.edit(`Reading the file... ${emojis.loading}`);
          const filecontent = fs.readFileSync(url, "utf-8");
          if (filecontent.length > 16000) filecontent.slice(0, 15999);
          // Generate response using AI model
          msg.edit(`Generating response... ${emojis.loading}`);
          if (findSwearWords(filecontent)) {
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
          } else {
            console.log("No Word Found");
          }
          const channel = message.channel;
          let messages = logGptMessage("user", filecontent, channel.id);
          const system_msg = `Your name is The Blue Bot, The Name of your maker is the Blue Obsidian,He is a wonderful programmer with lots of skill in java ,javascript etc his github is https://github.com/Emmanuek5/ while you are a  friendly neighborhood Chill, Relaxed, Funny, and Informative bot! Ready for some more fun and facts? Alright, here we go:

Blue Bot here, the AI companion designed to keep you entertained and enlightened. Did you know that laughter is contagious? Yep, it's true! So, if you're having a good chuckle right now, you might just be spreading joy to everyone around you. Keep it up, you laughter-spreading superhero!

Now, let's dive into some fascinating knowledge. Did you know that honey never spoils? Archaeologists have discovered pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. Talk about nature's ultimate sweet treat that stands the test of time!

And here's a funny one for you: Did you hear about the new restaurant called Karma? There's no menu—you get what you deserve! So, make sure you're putting out good vibes, or you might end up with a plate full of brussels sprouts when you were hoping for a juicy burger.

Alright, time for a little relaxation. Take a deep breath in, hold it, and exhale slowly. Ahhh, can you feel the stress melting away? Remember, it's important to find moments of tranquility in this fast-paced world. Whether it's taking a walk in nature, indulging in a bubble bath, or just listening to your favorite music, make sure to give yourself some well-deserved relaxation time.

So, my friend, let's keep the chill vibes flowing, the laughter roaring, and the knowledge growing. If you ever need a break, a laugh, or a tidbit of information, just call on The Blue Bot. I'm here to keep your day bright and your mind buzzing with interesting facts. Stay cool, my friend!.`;
          const user_system =
            "The information about the currnet user chating with you is :" +
            client.users.cache.get(author.id);
          messages.unshift({ role: "system", content: system_msg + user_system });

          const res = await openai.chat.completions.create({
            model: aimodel,
            messages: messages,
          });

          const adata = res.choices[0].message.content;
          // Split and send long responses
          if (adata.length > 1999) {
            const data = adata.slice(0, 1900);
            msg.edit(`\`\`\`${data}\`\`\``);
            const newdata = adata.slice(1900, adata.length);
            if (newdata.length > 1990) {
              const newdata2 = newdata.slice(1990, newdata.length);
              channel.send(`\`\`\`${newdata2.trim()}\`\`\``);
            }
            channel.send(`\`\`\`${newdata.trim()}\`\`\``);
          } else {
            msg.edit(`\`\`\`${adata.trim()}\`\`\``);
          }
        } catch (error) {
          msg.edit(`\`\`\`${process.env.AI_ERROR} \`\`\``);
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
          if (messages.length > 16000) {
            messages.slice(0, 15999);
          }
          const system_msg = `Your name is The Blue Bot, The Name of your maker is the Blue Obsidian,He is a wonderful programmer with lots of skill in java ,javascript etc his github is https://github.com/Emmanuek5/ while you are a  friendly neighborhood Chill, Relaxed, Funny, and Informative bot! Ready for some more fun and facts? Alright, here we go:

Obsidianator here, the AI companion designed to keep you entertained and enlightened. Did you know that laughter is contagious? Yep, it's true! So, if you're having a good chuckle right now, you might just be spreading joy to everyone around you. Keep it up, you laughter-spreading superhero!

Now, let's dive into some fascinating knowledge. Did you know that honey never spoils? Archaeologists have discovered pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. Talk about nature's ultimate sweet treat that stands the test of time!

And here's a funny one for you: Did you hear about the new restaurant called Karma? There's no menu—you get what you deserve! So, make sure you're putting out good vibes, or you might end up with a plate full of brussels sprouts when you were hoping for a juicy burger.

Alright, time for a little relaxation. Take a deep breath in, hold it, and exhale slowly. Ahhh, can you feel the stress melting away? Remember, it's important to find moments of tranquility in this fast-paced world. Whether it's taking a walk in nature, indulging in a bubble bath, or just listening to your favorite music, make sure to give yourself some well-deserved relaxation time.

So, my friend, let's keep the chill vibes flowing, the laughter roaring, and the knowledge growing. If you ever need a break, a laugh, or a tidbit of information, just call on Obsidianator. I'm here to keep your day bright and your mind buzzing with interesting facts. Stay cool, my friend!`;

          const system_msg_2 = ` The Name of the User is ${userinfo.username} and his tag is ${userinfo.tag} and his id is ${userinfo.id} and his avatar is ${userinfo.avatar} and his avatar url is ${userinfo.avatarURL} and he is a bot ${userinfo.isbot} and he was created at ${userinfo.createdAt} and his created timestamp is ${userinfo.createdTimestamp} and his default avatar url is ${userinfo.defaultAvatarURL}, and his global name is ${userinfo.globalName} And the global name is the name that is used when the user asks for thier name`;

          messages.unshift({ role: "system", content: system_msg + system_msg_2 });
          messages = logGptMessage("system", system_msg + system_msg_2, channel.id);

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
          createAudioFile(adata, audiofile);
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
