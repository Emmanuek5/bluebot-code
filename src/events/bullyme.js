const { Client, Message, EmbedBuilder } = require("discord.js");
const { findSwearWords } = require("../utils/swearfinder");
const fetch = require("node-fetch");
const { sleep } = require("../functions/functions");
const { Configuration, OpenAI } = require("openai");
const fs = require("fs");
require("dotenv").config();
const conversation = [];
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});
async function bully(client, message) {
  const channel = message.channel;
  const guild = message.guild;
  const { username, id, avatarURL } = message.author;
  const { content } = message;
  const clause = content.toLowerCase();

  try {
    const { id } = message.author;
    const system = `You are a bot to be bullied You are to respond with either insults or questions or sarcastic comments.  The user is ${username} `;
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system },
        { role: "user", content: content },
      ],
    });
    console.log(res.choices[0].message);
    const data = res.choices[0].message.content;
    if (data.length > 1999) {
      const data = data.slice(0, 1900);
      channel.send(data);
      const newdata = data.slice(1900, data.length);
      if (newdata.length > 1990) {
        const newdata2 = newdata.slice(1990, newdata.length);
        channel.send(newdata2.trim());
      }
      channel.send(newdata.trim());
    } else {
      channel.send(data.trim());
    }
  } catch (error) {
    channel.send(`\`\`\`${process.env.AI_ERROR} \`\`\``);
    console.log(error.message);
  }

  if (content.toLowerCase == "joke") {
    // Get a random joke from the API
    const joke = await fetch(process.env.JOKE_API);
    const jokejson = await joke.json();
    0;
    const { setup, delivery } = jokejson;

    channel.send(setup).then(async msg => {
      await sleep(3000);
      msg.edit(delivery);
    });
  }
}

module.exports = { bully };
